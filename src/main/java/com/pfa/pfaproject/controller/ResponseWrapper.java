package com.pfa.pfaproject.controller;

import java.util.HashMap;
import java.util.Map;

public class ResponseWrapper {
    public static Map<String, Object> error(String message){
        Map<String, Object> map = new HashMap<>();
        map.put("status", "error");
        map.put("message", message);
        return map;
    }

    public static Map<String, Object> success(Object data){
        HashMap<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", data);
        return map;
    }
}
