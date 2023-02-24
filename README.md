# GitHub Action - Deploy to Google Container Registry

Esta action do GitHub permite automatizar o processo de deploy de imagens Docker no Google Container Registry. Com ela, você pode construir e implantar facilmente contêineres na infraestrutura da nuvem do Google Cloud Platform.

## Como usar

Para utilizar essa action em seu repositório do GitHub, você precisa criar um workflow que a invoque. Para isso, crie um arquivo YAML na pasta `.github/workflows` do seu projeto com o seguinte conteúdo:

```yaml
name: Deploy Docker image to Google Container Registry
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Google Artifactory
      uses: <seu-nome-de-usuário>/<seu-repositório>@v1
      with:
        credentials_json: ${{ secrets.JSON_GCLOUD_SERVICE_ACCOUNT_JSON }}
        gcp_project: dev-castroneto
        gcp_registry: us-east4-docker.pkg.dev
        gcp_repository: argus
        image_name: email-consumer
        image_tag: latest
```

Certifique-se de substituir os valores dos campos credentials_json, gcp_project, gcp_registry, gcp_repository, image_name e image_tag pelos valores correspondentes ao seu projeto.