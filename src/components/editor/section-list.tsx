"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import {
  selectSections,
  addSection,
  removeSection,
  reorderSections,
} from "@/lib/store/slices/draft-page-slice";
import {
  selectSelectedSectionId,
  selectSection,
} from "@/lib/store/slices/ui-slice";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  MousePointer,
  Copy,
  Layers,
  LayoutGrid,
  Quote,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  createDefaultHeroProps,
  createDefaultCtaProps,
  createDefaultFeaturesProps,
  createDefaultTestimonialProps,
  type PageSection,
} from "@/lib/schemas/sections";

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  section: PageSection;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon =
    section.type === "hero"
      ? ImageIcon
      : section.type === "features"
      ? LayoutGrid
      : section.type === "testimonial"
      ? Quote
      : MousePointer;

  let title = "";
  if (section.type === "hero") {
    title = section.title;
  } else if (section.type === "features") {
    title = section.title;
  } else if (section.type === "testimonial") {
    title = section.author;
  } else if (section.type === "cta") {
    title = section.heading;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer group transition-all duration-150 ${
        isSelected
          ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/10"
          : "border-[#E5E7EB] hover:border-[#4F46E5]/50"
      }`}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="text-[#777587] hover:text-[#151C27] cursor-grab p-1"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div
        className={`p-1.5 rounded-lg ${
          section.type === "hero"
            ? "bg-indigo-50 text-[#4F46E5]"
            : section.type === "features"
            ? "bg-emerald-50 text-emerald-600"
            : section.type === "testimonial"
            ? "bg-purple-50 text-purple-600"
            : "bg-amber-50 text-amber-600"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
          {section.type === "hero"
            ? "Hero"
            : section.type === "features"
            ? "Features"
            : section.type === "testimonial"
            ? "Testimonial"
            : "CTA"}
        </span>
        <span className="block text-sm font-semibold text-[#151C27] truncate">
          {title || (
            <span className="text-[#777587] italic">Untitled section</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 hover:bg-slate-100 hover:text-[#4F46E5]"
          onClick={onDuplicate}
          title="Duplicate section"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 hover:bg-red-50 hover:text-red-600"
          onClick={onDelete}
          title="Delete section"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function SectionList() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector(selectSections);
  const selectedId = useAppSelector(selectSelectedSectionId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      dispatch(
        reorderSections({
          activeId: active.id as string,
          overId: over.id as string,
        })
      );
    }
  };

  const handleAddHero = () => {
    const section: PageSection = {
      id: uuidv4(),
      ...createDefaultHeroProps(),
    } as PageSection;
    dispatch(addSection({ section }));
    dispatch(selectSection(section.id));
  };

  const handleAddCta = () => {
    const section: PageSection = {
      id: uuidv4(),
      ...createDefaultCtaProps(),
    } as PageSection;
    dispatch(addSection({ section }));
    dispatch(selectSection(section.id));
  };

  const handleAddFeatures = () => {
    const section: PageSection = {
      id: uuidv4(),
      ...createDefaultFeaturesProps(),
    } as PageSection;
    dispatch(addSection({ section }));
    dispatch(selectSection(section.id));
  };

  const handleAddTestimonial = () => {
    const section: PageSection = {
      id: uuidv4(),
      ...createDefaultTestimonialProps(),
    } as PageSection;
    dispatch(addSection({ section }));
    dispatch(selectSection(section.id));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeSection(id));
    if (selectedId === id) {
      dispatch(selectSection(null));
    }
  };

  const handleDuplicate = (section: PageSection, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: PageSection = {
      ...section,
      id: uuidv4(),
    };
    dispatch(addSection({ section: duplicated }));
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] border-r border-[#E5E7EB] w-[280px]">
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
        <h3 className="text-sm font-semibold text-[#151C27] flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#4F46E5]" />
          Page Sections
        </h3>
        <span className="text-[11px] font-mono text-[#6B7280] bg-slate-100 px-1.5 py-0.5 rounded">
          {sections.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {sections.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-[#E5E7EB] rounded-xl bg-white p-4">
            <Layers className="w-8 h-8 text-[#777587]/30 mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#151C27]">
              No sections yet
            </p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">
              Add section elements using buttons below.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sections.map((section, idx) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    index={idx}
                    isSelected={selectedId === section.id}
                    onSelect={() => dispatch(selectSection(section.id))}
                    onDelete={(e) => handleDelete(section.id, e)}
                    onDuplicate={(e) => handleDuplicate(section, e)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="p-4 border-t border-[#E5E7EB] bg-white grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-[#E5E7EB] hover:border-[#4F46E5] text-[#151C27] hover:text-[#4F46E5] gap-1 text-xs px-2 h-9"
          onClick={handleAddHero}
        >
          <Plus className="w-3.5 h-3.5" />
          Hero
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#E5E7EB] hover:border-[#4F46E5] text-[#151C27] hover:text-[#4F46E5] gap-1 text-xs px-2 h-9"
          onClick={handleAddCta}
        >
          <Plus className="w-3.5 h-3.5" />
          CTA
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#E5E7EB] hover:border-[#4F46E5] text-[#151C27] hover:text-[#4F46E5] gap-1 text-xs px-2 h-9"
          onClick={handleAddFeatures}
        >
          <Plus className="w-3.5 h-3.5" />
          Features
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#E5E7EB] hover:border-[#4F46E5] text-[#151C27] hover:text-[#4F46E5] gap-1 text-xs px-2 h-9"
          onClick={handleAddTestimonial}
        >
          <Plus className="w-3.5 h-3.5" />
          Testimonial
        </Button>
      </div>
    </div>
  );
}
