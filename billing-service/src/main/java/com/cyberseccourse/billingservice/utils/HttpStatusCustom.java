package com.cyberseccourse.billingservice.utils;

public enum HttpStatusCustom {
    USERNAME_EXISTS(991, "Username already exists");

    private final int value;
    private final String reason;
    HttpStatusCustom(int value, String reason) {
        this.value = value;
        this.reason = reason;
    }

    public int value() { return value; }
    public String reason() { return reason; }
}

