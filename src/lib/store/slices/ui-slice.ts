import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  activePanel: "sections" | "properties" | null;
  selectedSectionId: string | null;
  isPreviewMode: boolean;
  isSaving: boolean;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  activePanel: "sections",
  selectedSectionId: null,
  isPreviewMode: false,
  isSaving: false,
  sidebarOpen: true,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActivePanel(
      state,
      action: PayloadAction<"sections" | "properties" | null>
    ) {
      state.activePanel = action.payload;
    },

    selectSection(state, action: PayloadAction<string | null>) {
      state.selectedSectionId = action.payload;
      if (action.payload) {
        state.activePanel = "properties";
      }
    },

    togglePreviewMode(state) {
      state.isPreviewMode = !state.isPreviewMode;
    },

    setPreviewMode(state, action: PayloadAction<boolean>) {
      state.isPreviewMode = action.payload;
    },

    setSaving(state, action: PayloadAction<boolean>) {
      state.isSaving = action.payload;
    },

    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setActivePanel,
  selectSection,
  togglePreviewMode,
  setPreviewMode,
  setSaving,
  toggleSidebar,
  setSidebarOpen,
} = uiSlice.actions;

// ─── Selectors ───
export const selectActivePanel = (state: { ui: UiState }) =>
  state.ui.activePanel;
export const selectSelectedSectionId = (state: { ui: UiState }) =>
  state.ui.selectedSectionId;
export const selectIsPreviewMode = (state: { ui: UiState }) =>
  state.ui.isPreviewMode;
export const selectIsSaving = (state: { ui: UiState }) => state.ui.isSaving;
export const selectSidebarOpen = (state: { ui: UiState }) =>
  state.ui.sidebarOpen;

export default uiSlice.reducer;
