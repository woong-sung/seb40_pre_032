package com.codestates.pre032.pre032.security.github;

import com.codestates.pre032.pre032.security.jwt.JwtTokenizer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.websocket.server.PathParam;

@RestController
public class LoginController {
    private final LoginService loginService;

    private final JwtTokenizer jwtTokenizer;
    public LoginController(LoginService loginService, JwtTokenizer jwtTokenizer) {
        this.loginService = loginService;
        this.jwtTokenizer = jwtTokenizer;
    }

    @GetMapping("/login/oauth2/code/github/")
    public ResponseEntity<String> githubLogin(@PathParam("code") String code, HttpServletResponse response) {
        GithubToken githubToken = loginService.getAccessToken(code);
        response.setHeader("Authorization", githubToken.getAuthorizationValue());
        loginService.getLogin(githubToken.getAccessToken());

        String jws = githubToken.getAuthorizationValue().replace("bearer ","");
        System.out.println(jws);
//        System.out.println(jwtTokenizer.getClaims(jws, jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey())).getBody());
//        System.out.println(jwtTokenizer.getClaims(jws, jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey())).getSignature());
        return ResponseEntity.ok("logined");
    }


}