package gold.dim.LWVC.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class C1 {
    @GetMapping("/")
    public String index(){
        return "helloworld";
    }
}
