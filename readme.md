# Desafio FullStack Munai

Obrigado por participar de nosso processo seletivo.

## Instruções

### Crie um repositório no seu GitHub

### Faça seus commits descritivos e específicos no seu repositório

Atenção, avaliaremos o conteúdo de seus commits, bem como a frequência de envio. Também é importante que a descrição dos commits esteja de acordo com o conteúdo.

### Configurar ambiente docker para rodar a aplicação

Ao final do desenvolvimento, o projeto deve rodar com o commando:

```bash
docker compose up
```

## Critérios de Avaliação

Além dos requisitos levantados acima, iremos olhar para os seguintes critérios durante a correção do desafio:

- O projeto deve ser extensível, havendo espaço para possíveis incrementos de funcionalidades e alteração da base de dados;
- Gerenciamento de estado;
- Componentização;
- Responsividade;
- Preocupação com usabilidade;
- Preocupação com acessibilidade;
- Testes automatizados (unitários, integração);
- Utilização de variáveis de ambiente;
- Padronização de código, seguindo design patterns conhecidos, como: SOLID, hexagonal, etc;
- [Padrão de commits](https://www.conventionalcommits.org/pt-br/v1.0.0/);
- Código em inglês.

## O desafio

O desafio será implementar um widget de chat, seguindo os seguintes requisitos:

## Back-end

Pode ser feito em NodeJs ou Python, seguindo os requisitos a baixo:

|                        | NodeJs                                                                                       | Python                                |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------- |
| Versão                 | v18                                                                                          | v3.10                                 |
| Gerenciador de pacotes | [Yarn 1](https://yarnpkg.com/), [NPM](https://www.npmjs.com/) ou [PNPM](https://pnpm.io/pt/) | [Poetry](https://python-poetry.org/)  |
| Lint                   | [Airbnb EsLint](https://www.npmjs.com/package/eslint-config-airbnb)                          | [Black](https://github.com/psf/black) |

- _Preferencialmente utilizar typescript no nodeJs;_
- _Utilizar tipagem no código python irá facilitar no entendimento do seu código._

### Funcionalidades

#### [ ] API

O back-end deve ser composto por uma API Rest que irá interagir com o front-end por meio de endpoints e também comunicação em tempo real.

#### [ ] Criação de usuário

Deve possuir uma rota que permita a criação de usuários. Os dados de cada usuário devem ser persistidos em uma base de dados relacional.

#### [ ] Chat universal

A API deve possuir a funcionalidade de chat, que deverá funcionar da seguinte forma:
Quando a API receber um evento de mensagem, deve persistir o conteúdo na base **relacionando o autor**, e então comunicar um evento para **todos os clientes conectados** com o conteúdo recebido, bem como quem foi o **autor e horário**.
Quando um novo cliente se conectar ou desconectar ao servidor, todos os clientes conectados devem receber uma **notificação de conexão/desconexão**, juntamente com a identificação do **usuário e horário**.

## Front-end

Preferencialmente react, mas pode escolher o framework que mais se sinta **confortável**;

Se baseie no wireframe abaixo:

<img src="./assets/wireframe.png" alt="Wireframe" height="auto" style="max-width: 700;" />

#### [ ] Tela para cadastro de nome

Para se conectar na aplicação é necessário inserir um nome para ficar atrelado as suas mensagens.

#### [ ] Enviar e receber mensagens

A aplicação deverá conter um sistema para envio e recebimento de mensagem por evento.
Deve ser um chat universal para todos conectados na aplicação exibindo o nome do autor e o horário junto a mensagem.

#### [ ] Widget canto de tela

Será um widget que inicialmente ficará minimizado como um ícone no canto da tela, abrindo ao click.

---

_O desafio acima foi cuidadosamente construído para propósitos de avaliação apenas._
