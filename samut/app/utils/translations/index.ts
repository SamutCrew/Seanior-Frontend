// src/translations/index.ts

import { authTranslations } from "./auth";
import { homeTranslations } from "./home";
import { workflowTranslations } from "./workflow";
import { flowcanvasTranslations } from "./flowcanvs";
import { datasetTranslations } from "./dataset";
import { modelTranslations } from "./model";
import { templateTranslations } from "./template";
import { toastTranslations } from "./toast";

export const resources = {
  en: {
    auth: authTranslations.en,
    home: homeTranslations.en,
    workflow: workflowTranslations.en,
    flowcanvas: flowcanvasTranslations.en,
    dataset: datasetTranslations.en,
    model: modelTranslations.en,
    template: templateTranslations.en,
    toast: toastTranslations.en,
  },
  th: {
    auth: authTranslations.th,
    home: homeTranslations.th,
    workflow: workflowTranslations.th,
    flowcanvas: flowcanvasTranslations.th,
    dataset: datasetTranslations.th,
    model: modelTranslations.th,
    template: templateTranslations.th,
    toast: toastTranslations.th,
  },
};
