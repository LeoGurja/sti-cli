# Sti Cli
Interface de linha de comando para configuração de ambiente

# Instalação
simplesmente execute no seu terminal:
```bash
  sudo npm i -g @sti-uff/cli
```


# Uso
## vpn
primeiro, instale o serviço da vpn dentro do systemd:
```bash
  sti vpn install
```
agora, salve suas credenciais dentro da Cli:
```bash
  sti vpn login
```
inicie o serviço:
```bash
  sti vpn start
```
finalmente, verifique se tudo está funcionando corretamente:
```bash
  sti vpn status
```

## repo
será necessário estar com a vpn ativa para utilizar esse subcomando

para fazer login, será necessário [criar e copiar um token de acesso no gitlab](https://app.sti.uff.br/gitlab/profile/personal_access_tokens)  
**todas as permissões são necessárias para o token**

agora, faça o login:
```bash
  sti repo login
```
pronto! agora você pode clonar projetos à vontade
```bash
  sti repo clone apps/sispos-gestao-academica
```

# Compatibilidade
A Cli deve funcionar com qualquer distribuição que utilize Systemd e apt-get
Para saber se seu sistema utiliza o Sytemd execute:
```bash
  file /sbin/init
```
a saída esperada deve ser:
```
  symbolic link to /lib/systemd/systemd
```
