import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PageSection } from "@/lib/schemas/sections";
import type { PageMetadata } from "@/lib/schemas/page";

interface DraftPageState {
  metadata: PageMetadata | null;
  sections: PageSection[];
  isDirty: boolean;
}

const initialState: DraftPageState = {
  metadata: null,
  sections: [],
  isDirty: false,
};

export const draftPageSlice = createSlice({
  name: "draftPage",
  initialState,
  reducers: {
    setPage(
      state,
      action: PayloadAction<{ metadata: PageMetadata; sections: PageSection[] }>
    ) {
      state.metadata = action.payload.metadata;
      state.sections = action.payload.sections;
      state.isDirty = false;
    },

    addSection(
      state,
      action: PayloadAction<{ section: PageSection; index?: number }>
    ) {
      const { section, index } = action.payload;
      if (index !== undefined && index >= 0 && index <= state.sections.length) {
        state.sections.splice(index, 0, section);
      } else {
        state.sections.push(section);
      }
      state.isDirty = true;
    },

    removeSection(state, action: PayloadAction<string>) {
      state.sections = state.sections.filter((s) => s.id !== action.payload);
      state.isDirty = true;
    },

    reorderSections(
      state,
      action: PayloadAction<{ activeId: string; overId: string }>
    ) {
      const { activeId, overId } = action.payload;
      const oldIndex = state.sections.findIndex((s) => s.id === activeId);
      const newIndex = state.sections.findIndex((s) => s.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const [removed] = state.sections.splice(oldIndex, 1);
        state.sections.splice(newIndex, 0, removed);
        state.isDirty = true;
      }
    },

    updateSectionProps(
      state,
      action: PayloadAction<{ id: string; updates: Partial<PageSection> }>
    ) {
      const index = state.sections.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.sections[index] = {
          ...state.sections[index],
          ...action.payload.updates,
        } as PageSection;
        state.isDirty = true;
      }
    },

    updateMetadata(state, action: PayloadAction<Partial<PageMetadata>>) {
      if (state.metadata) {
        state.metadata = { ...state.metadata, ...action.payload };
        state.isDirty = true;
      }
    },

    resetDraft(state) {
      state.metadata = null;
      state.sections = [];
      state.isDirty = false;
    },

    markClean(state) {
      state.isDirty = false;
    },
  },
});

export const {
  setPage,
  addSection,
  removeSection,
  reorderSections,
  updateSectionProps,
  updateMetadata,
  resetDraft,
  markClean,
} = draftPageSlice.actions;

// ─── Selectors ───
export const selectSections = (state: { draftPage: DraftPageState }) =>
  state.draftPage.sections;
export const selectMetadata = (state: { draftPage: DraftPageState }) =>
  state.draftPage.metadata;
export const selectIsDirty = (state: { draftPage: DraftPageState }) =>
  state.draftPage.isDirty;

export default draftPageSlice.reducer;
