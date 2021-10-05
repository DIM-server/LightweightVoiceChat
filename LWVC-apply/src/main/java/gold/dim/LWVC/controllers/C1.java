package gold.dim.LWVC.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class C1 {
    @RequestMapping("/")
    public String index(){
        return "index.html";
    }
}