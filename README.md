# Movie Recommender Application

- Este repositório apresenta um **Sistema de Recomendação de filmes** (*Movie Recommender Application*), desenvolvido como parte do curso de Ciência da Computação. O sistema de recomendação utiliza avaliações de usuários para destacar os filmes mais bem avaliados;

- A aplicação foi desenvolvida com um *backend* em **Python (Flask)**, integrando o **Azure SQL** e o **Azure Blob Storage** para o gerenciamento de filmes, usuários e capas de filmes. O *frontend* foi implementado com **React**, **JavaScript**, **HTML** e **CSS**.

⚠️ Atenção: Este projeto foi implementado para funcionar de forma integrada com o serviço de nuvem da Azure.

**Palavras-chave**: Recomendação de Filmes; API REST; Flask; React; Azure.

## Objetivo do Projeto

O projeto tem como objetivo desenvolver um sistema de recomendação de filmes com as seguintes características:

- **Back-end**: Gerencia a comunicação com o banco de dados, armazenando informações sobre filmes e preferências dos usuários.
- **Front-end**: Interface responsiva onde os usuários podem visualizar recomendações, classificar filmes assistidos e adicionar filmes aos favoritos. O estilo da aplicação é feito com HTML e CSS.
- **Funcionalidades**: Recomendação baseada em preferências, histórico de visualização e uma interface de busca de filmes.

## Requisitos
- Python 3.8+
- Flask, SQLAlchemy, Azure SDK, React.

## Descrição

A aplicação permite que os usuários façam login, avaliem filmes e visualizem os filmes mais bem avaliados. As capas dos filmes são armazenadas no **Azure Blob Storage**. O sistema utiliza autenticação via **Azure AD** com tokens JWT e permite a interação segura com os dados do **banco Azure SQL**. Veja o resultado [aqui](https://youtu.be/zi5nf9q49Rk)

## Funcionalidades

- Login e Autenticação: Implementado via Azure AD com tokens JWT;
- *Upload* de Capas de Filmes: Utilizando o Azure Blob Storage;
- Avaliação de Filmes: Usuários podem classificar filmes de 1 a 5 estrelas;
- Visualização de Filmes Bem Avaliados: Exibe os filmes mais bem classificados;
- Gerenciamento de Usuários e Filmes: Adição de novos usuários e filmes ao sistema.

### 🔗Autores & Contribuições

- [franciscoaero](https://github.com/franciscoaero) [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marcelinofrancisco/)
