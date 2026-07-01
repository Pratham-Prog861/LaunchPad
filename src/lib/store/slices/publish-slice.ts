import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Release, BumpType } from "@/lib/schemas/page";

interface PublishState {
  currentVersion: string;
  releases: Release[];
  isPublishing: boolean;
  selectedBumpType: BumpType;
  releaseNotes: string;
}

const initialState: PublishState = {
  currentVersion: "0.0.0",
  releases: [],
  isPublishing: false,
  selectedBumpType: "patch",
  releaseNotes: "",
};

export const publishSlice = createSlice({
  name: "publish",
  initialState,
  reducers: {
    setCurrentVersion(state, action: PayloadAction<string>) {
      state.currentVersion = action.payload;
    },

    setReleases(state, action: PayloadAction<Release[]>) {
      state.releases = action.payload;
    },

    addRelease(state, action: PayloadAction<Release>) {
      state.releases.unshift(action.payload);
      state.currentVersion = action.payload.version;
    },

    setIsPublishing(state, action: PayloadAction<boolean>) {
      state.isPublishing = action.payload;
    },

    setSelectedBumpType(state, action: PayloadAction<BumpType>) {
      state.selectedBumpType = action.payload;
    },

    setReleaseNotes(state, action: PayloadAction<string>) {
      state.releaseNotes = action.payload;
    },

    resetPublishForm(state) {
      state.selectedBumpType = "patch";
      state.releaseNotes = "";
      state.isPublishing = false;
    },
  },
});

export const {
  setCurrentVersion,
  setReleases,
  addRelease,
  setIsPublishing,
  setSelectedBumpType,
  setReleaseNotes,
  resetPublishForm,
} = publishSlice.actions;

// ─── Selectors ───
export const selectCurrentVersion = (state: { publish: PublishState }) =>
  state.publish.currentVersion;
export const selectReleases = (state: { publish: PublishState }) =>
  state.publish.releases;
export const selectIsPublishing = (state: { publish: PublishState }) =>
  state.publish.isPublishing;
export const selectSelectedBumpType = (state: { publish: PublishState }) =>
  state.publish.selectedBumpType;
export const selectReleaseNotes = (state: { publish: PublishState }) =>
  state.publish.releaseNotes;

export default publishSlice.reducer;
