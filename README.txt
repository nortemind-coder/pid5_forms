# PID-5 – Apps Script (2 páginas)

Arquivos deste pacote:
- Code.gs
- index.html
- form.html

Como usar:
1) No Google Drive, crie um novo projeto em https://script.google.com e adicione três arquivos com os mesmos nomes.
2) Cole o conteúdo de cada arquivo.
3) Ajuste o nome da planilha e aba se necessário:
   - `SPREADSHEET_NAME = 'Respostas PID-5'`
   - `SHEET_NAME = 'Respostas'`
4) Em sua planilha, deixe o cabeçalho em: `Timestamp | Nome | Idade | SubmissionID | Q1 | ... | Q220`
   (O script também consegue criar/ajustar automaticamente se não existir.)
5) Implante como **App da Web** (Executar como: Você; Quem pode acessar: Qualquer pessoa com o link).
6) Abra o link e utilize:
   - Página inicial: `?page=home` (padrão)
   - Formulário: `?page=form`
