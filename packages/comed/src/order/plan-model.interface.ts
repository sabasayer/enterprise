export interface PlanModel {
    usage?: string;
    title?: string;

    offerNote?: string;

    parentId?: number;

    referenceType?: string;
    referenceId?: number;

    patientId?: number;
    visitId?: number;

    deleteNote?: string;
    /**
     * enum.executionType
     */
    executionType?: number;
    /**
     * entity.vademecumMedicationType
     */
    medicationTimeId?: number;
    executionNote?: string;

    /**
     * description.executionNecessity
     *  (this only used at ui)
     */
    executionNecessityCode?: string;
    necessityNote?: string;

    /**
     * enum.frequencyType
     */
    frequencyType?: number;
    dailyFrequencyType?: number;
    /**
     * enum.frequencyPeriodType
     */
    frequencyPeriodType?: number;
    /**
     * enum.frequencyPeriodTimeScale
     */
    frequencyPeriodTimeScale?: number;
    frequencyPeriod?: number;
    /**
     * enum.dayOfWeek
     */
    frequencyDaysOfWeek?: number;

    /**
     * enum.treatmentType
     */
    treatmentType?: number;
    treatmentTimeType?: number;
    /**
     * enum.treatmentPeriodTimeScale
     */
    treatmentPeriodTimeScale?: number;
    treatmentStartDate?: string;
    treatmentEndDate?: string;
    treatmentPeriod?: number;
    treatmentTimes?: number;

    isOnline?: boolean;
    createdAt?: string;
}
