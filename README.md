# Checklist AS • Gestação & Puericultura

Site estático em HTML, CSS e JavaScript com tema fofo de gestação e puericultura, pronto para publicar no **GitHub Pages**.

## Estrutura
- `index.html` → página principal
- `styles.css` → visual do site
- `script.js` → renderização dos checklists e salvamento do progresso no navegador
- `assets/hero-mother-baby.svg` → ilustração principal

## Como publicar no GitHub Pages
1. Crie um repositório no GitHub.
2. Envie todos estes arquivos para a raiz do repositório.
3. Vá em **Settings > Pages**.
4. Em **Source**, selecione **Deploy from a branch**.
5. Escolha a branch principal, normalmente `main`, e a pasta `/root`.
6. Salve.
7. O GitHub vai gerar um link do tipo:
   `https://seu-usuario.github.io/nome-do-repositorio/`

## Personalizações fáceis
- Troque as cores em `styles.css`
- Edite os textos e os tópicos em `script.js`
- Se quiser adicionar novas imagens, coloque na pasta `assets`

## Observação
O progresso dos checklists fica salvo no navegador com `localStorage`. Então a usuária pode marcar o que já estudou e continuar depois sem perder tudo.


## Página extra de questões
Além do checklist principal (`index.html`), o site agora tem uma área separada com banco de questões:

- `questoes.html` → página com 10 questões por tópico
- `questoes-data.js` → banco das questões
- `questoes.js` → lógica da página

No GitHub Pages, basta manter esses arquivos na mesma raiz do projeto.
