package com.CyberSecCourse.FinalProject.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum InvoiceStatus { @JsonProperty("pending") PENDING, @JsonProperty("wfad") WFAD, @JsonProperty("cancelled") CANCELLED, @JsonProperty("delivery") DELIVERY, @JsonProperty("done") DONE, @JsonProperty("rr") RR, @JsonProperty("refunded") REFUNDED; }