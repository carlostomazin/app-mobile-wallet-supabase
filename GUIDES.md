## Configurando Sing In com o Google no supabase

### Configuração Google
1. Crie as credencias OAuth 2.0 no console da google (https://console.cloud.google.com). Deverá ser criado duas, uma do tipo Android e outra do tipo Web. Nenhuma configuração é necessária nas credencias.

2. Para criar a credencial do tipo Android, execute o seguinte comando `cd android && ./gradlew signingReport` na pasta do projeto para gerar o SHA-1. Execute o comando no terminal git-bash.

3. Na página "Tela de permissão OAuth > Usuários de teste" adicione os emails que serão utilizados nos testes.

### Configuração Supabase
1. Ative o provider Google

2. No campo "Client IDs" adicione os dois client id's das credencias criadas, lembre de separar por virgula. Exemplo: <client_id_android>,<client_id_web>

3. No campo "Client Secret (for OAuth)" coloque a "Chave secreta do cliente" da credencial Web.


### Implementação do código
https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=react-native