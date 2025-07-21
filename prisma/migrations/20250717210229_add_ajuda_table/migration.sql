-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visualizado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cadastro_pacientes" (
    "id" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Data_de_Nascimento" TEXT NOT NULL,
    "CPF_CNPJ" TEXT NOT NULL,
    "Endereco" TEXT NOT NULL,
    "Numero" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "Cidade" TEXT NOT NULL,
    "Estado" TEXT NOT NULL,
    "Nome_do_Pai_ou_Responsavel" TEXT NOT NULL,
    "Telefone_Pai" TEXT NOT NULL,
    "Nome_da_Mae_ou_Responsavel" TEXT NOT NULL,
    "Telefone_Mae" TEXT NOT NULL,
    "Especialista" TEXT NOT NULL,
    "recoveryCode" INTEGER,
    "Eh_Crianca" BOOLEAN NOT NULL,

    CONSTRAINT "Cadastro_pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Especialista" TEXT NOT NULL,
    "Data_do_Atendimento" TEXT NOT NULL,
    "Horario_da_consulta" TEXT NOT NULL,
    "Horario_de_Termino_da_consulta" TEXT NOT NULL,
    "Valor_da_Consulta" DOUBLE PRECISION,
    "Status_da_Consulta" TEXT NOT NULL,
    "Status_do_pagamento" TEXT NOT NULL,
    "observacao" TEXT NOT NULL,
    "recoveryCode" INTEGER,
    "Eh_Aluno" BOOLEAN NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro_convenio" (
    "id" TEXT NOT NULL,
    "Nome_do_Convenio" TEXT NOT NULL,
    "CNPJ" TEXT NOT NULL,
    "Valores" TEXT NOT NULL,
    "Data_de_Contratacao" TEXT NOT NULL,

    CONSTRAINT "cadastro_convenio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro_user" (
    "id" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Usuario" TEXT NOT NULL,
    "Senha" TEXT NOT NULL,
    "recoveryCode" INTEGER,
    "Profissional" BOOLEAN NOT NULL,
    "Secretaria" BOOLEAN NOT NULL,
    "foto" TEXT,

    CONSTRAINT "cadastro_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fluxo_de_caixa" (
    "id" TEXT NOT NULL,
    "Descricao" TEXT NOT NULL,
    "Valor" DOUBLE PRECISION NOT NULL,
    "Tipo" TEXT NOT NULL,
    "Data" TEXT NOT NULL,
    "Especialista" TEXT NOT NULL,

    CONSTRAINT "Fluxo_de_caixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Espera" (
    "id" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "Convenio" TEXT NOT NULL,
    "Especialista" TEXT NOT NULL,
    "Observacao" TEXT NOT NULL,

    CONSTRAINT "Espera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro_prof" (
    "id" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Faixa_Etaria_de_Atendimento" TEXT NOT NULL,
    "Dias_de_Atendimento" TEXT NOT NULL,
    "Horarios_de_Atendimento" TEXT NOT NULL,
    "Especialidade" TEXT NOT NULL,
    "Registro_do_Profissional" TEXT NOT NULL,
    "Especialista" TEXT NOT NULL,

    CONSTRAINT "cadastro_prof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atendimento" (
    "id" TEXT NOT NULL,
    "id_agendamento" TEXT NOT NULL,
    "id_paciente" TEXT NOT NULL,
    "conteudoAtestado" TEXT NOT NULL,
    "conteudoComparecimento" TEXT NOT NULL,
    "conteudoEncaminhamento" TEXT NOT NULL,
    "conteudoProntuario" TEXT NOT NULL,
    "conteudoAnamineseI" TEXT NOT NULL,
    "conteudoAnamineseA" TEXT NOT NULL,
    "conteudoNeuroI" TEXT NOT NULL,
    "conteudoNeuroA" TEXT NOT NULL,
    "dataHora" TEXT NOT NULL,
    "tempo" TEXT NOT NULL,

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ajuda" (
    "id" TEXT NOT NULL,
    "tela" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Recebido',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ajuda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cadastro_user_Usuario_key" ON "cadastro_user"("Usuario");

-- CreateIndex
CREATE UNIQUE INDEX "cadastro_prof_Especialista_key" ON "cadastro_prof"("Especialista");
