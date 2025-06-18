import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, '../pages')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/scripts', express.static(path.join(__dirname, '../scripts')));
app.use('/img', express.static(path.join(__dirname, '../img')));

app.post('/api/enviar-formulario', async (req, res) => {
  const { nome, nascimento, contato, email, cep } = req.body;

  if (!nome || nome.length < 3) return res.status(400).json({ erro: 'Nome inválido' });
  if (!nascimento) return res.status(400).json({ erro: 'Data de nascimento inválida' });
  if (!contato || !/^\d{10,11}$/.test(contato)) return res.status(400).json({ erro: 'Contato inválido' });
  if (!email || !/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ erro: 'Email inválido' });
  if (!cep || !/^\d{8}$/.test(cep)) return res.status(400).json({ erro: 'CEP inválido' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email do adm', // nessa parte tem que colocar o email da pessoa que vai ficar responsavel pelos emails do formulario
      pass: 'senha de app 2fa do adm'// nessa parte vc tem que ativar a verificação de duas etapas do email e depois acesse o myaccount.google.com/apppasswords e cria uma senha de app e dps cola aqui.
    }
  });

  const mailOptions = {
    from: `"Formulário AIPRA" <email do adm>`,// nessa parte tem que colocar o email da pessoa que vai ficar responsavel pelos emails do formulario
    to: 'email do adm',// nessa parte tem que colocar o email da pessoa que vai ficar responsavel pelos emails do formulario
    replyTo: email,
    subject: 'Formulário de Voluntário',
    html: `
      <h2>Dados do formulário:</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Nascimento:</strong> ${nascimento}</p>
      <p><strong>Telefone:</strong> ${contato}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>CEP:</strong> ${cep}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso!');
    res.status(200).json({ mensagem: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ erro: 'Erro ao enviar email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
