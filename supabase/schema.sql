-- ==============================================================================
-- SCHEMA SQL: SISTEMA DE CHAMADOS DE TI - CONSTRUTORA MAXIMO ALDANA
-- Execute este script no SQL Editor do seu projeto no Supabase
-- ==============================================================================

-- 1. Tabela de Obras / Locais
CREATE TABLE IF NOT EXISTS public.obras (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    cidade TEXT NOT NULL,
    engenheiro TEXT NOT NULL,
    progresso INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Operacional',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Categorias de TI & SLA
CREATE TABLE IF NOT EXISTS public.categorias (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    sla_horas INTEGER NOT NULL,
    cor TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Técnicos de TI
CREATE TABLE IF NOT EXISTS public.tecnicos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    especialidade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Chamados de TI
CREATE TABLE IF NOT EXISTS public.chamados (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    obra_id TEXT REFERENCES public.obras(id) ON DELETE SET NULL,
    obra_nome TEXT NOT NULL,
    localizacao TEXT NOT NULL,
    categoria_id TEXT REFERENCES public.categorias(id) ON DELETE SET NULL,
    categoria_nome TEXT NOT NULL,
    prioridade TEXT NOT NULL DEFAULT 'Média', -- Baixa, Média, Alta, Crítica
    status TEXT NOT NULL DEFAULT 'Aberto',   -- Aberto, Em Atendimento, Aguardando Peça, Concluído
    solicitante TEXT NOT NULL,
    tecnico_atribuido TEXT DEFAULT 'Pendente de Atribuição',
    anexo_base64 TEXT,
    anexo_nome TEXT,
    data_criacao TEXT NOT NULL,
    prazo_sla TEXT NOT NULL,
    data_conclusao TEXT,
    historico JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Termos de Responsabilidade de Notebooks
CREATE TABLE IF NOT EXISTS public.termos_notebooks (
    id TEXT PRIMARY KEY,
    codigo_termo TEXT NOT NULL UNIQUE,
    colaborador_nome TEXT NOT NULL,
    cargo TEXT NOT NULL,
    equipamento_modelo TEXT NOT NULL,
    numero_patrimonio TEXT NOT NULL,
    data_entrega TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Ativo', -- Ativo, Devolvido, Em Manutenção
    status_termo TEXT NOT NULL DEFAULT 'Assinado Digitalmente',
    assinatura_digital TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_chamados_status ON public.chamados(status);
CREATE INDEX IF NOT EXISTS idx_chamados_prioridade ON public.chamados(prioridade);
CREATE INDEX IF NOT EXISTS idx_chamados_obra ON public.chamados(obra_id);
CREATE INDEX IF NOT EXISTS idx_chamados_categoria ON public.chamados(categoria_id);
CREATE INDEX IF NOT EXISTS idx_chamados_data_criacao ON public.chamados(created_at DESC);

-- ==============================================================================
-- HABILITAÇÃO DO REALTIME (POSTGRES CHANGES)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.chamados;
ALTER PUBLICATION supabase_realtime ADD TABLE public.termos_notebooks;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - Permite leitura e escrita pública/autenticada
-- ==============================================================================
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chamados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.termos_notebooks ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir leitura geral
CREATE POLICY "Permitir leitura pública de obras" ON public.obras FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de categorias" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de tecnicos" ON public.tecnicos FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de chamados" ON public.chamados FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de termos" ON public.termos_notebooks FOR SELECT USING (true);

-- Políticas para permitir inserção/atualização/deleção de chamados
CREATE POLICY "Permitir inserção de chamados" ON public.chamados FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de chamados" ON public.chamados FOR UPDATE USING (true);
CREATE POLICY "Permitir deleção de chamados" ON public.chamados FOR DELETE USING (true);

-- Políticas para permitir inserção/atualização de termos
CREATE POLICY "Permitir inserção de termos" ON public.termos_notebooks FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de termos" ON public.termos_notebooks FOR UPDATE USING (true);

-- ==============================================================================
-- SEED INICIAL (DADOS PADRÃO DE OBRAS, CATEGORIAS E TÉCNICOS)
-- ==============================================================================
INSERT INTO public.obras (id, nome, cidade, engenheiro, progresso, status) VALUES
('loc-1', 'Obra Residencial Grand Aldana', 'São Bernardo do Campo - SP', 'Eng. Roberto Farias', 78, 'Operacional'),
('loc-2', 'Obra Edifício Horizon Prime', 'Santo André - SP', 'Engª. Camila Pires', 45, 'Operacional'),
('loc-3', 'Sede Corporativa Maximo Aldana', 'São Bernardo do Campo - SP', 'Coord. Marcelo Souza', 100, 'Operacional'),
('loc-4', 'Canteiro Reserva dos Mananciais', 'São Caetano do Sul - SP', 'Eng. Felipe Castro', 18, 'Operacional')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categorias (id, nome, sla_horas, cor, descricao) VALUES
('cat-1', 'Redes e Conectividade (Starlink / 4G)', 4, '#66C1BF', 'Queda de link, antena desalinhada, instabilidade no Wi-Fi do contêiner.'),
('cat-2', 'Hardware e Computadores de Engenharia', 12, '#4FA9A7', 'Notebooks Lenovo ThinkPad, travamentos de AutoCAD/Revit, troca de periféricos.'),
('cat-3', 'Impressoras de Plotter e Canteiro', 8, '#E2B552', 'Plotters HP DesignJet para plantas de engenharia, impressoras Brother de canteiro.'),
('cat-4', 'Sistemas ERP (Sienge / Office 365)', 6, '#8E7CF8', 'Acessos e senhas do ERP Sienge, contas @maximoaldana.com.br, Teams e SharePoint.'),
('cat-5', 'Controle de Acesso e CFTV de Canteiro', 6, '#E16666', 'Catracas biométricas de operários, câmeras Hikvision de monitoramento da obra.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tecnicos (id, nome, email, especialidade) VALUES
('tec-1', 'Pedro Henrique Santos', 'pedro.santos@maximoaldana.com.br', 'Infraestrutura e Redes de Obra'),
('tec-2', 'Lucas Nogueira', 'lucas.ti@maximoaldana.com.br', 'Suporte a Sistemas e Sienge ERP'),
('tec-3', 'Rafael Mendes', 'rafael.ti@maximoaldana.com.br', 'Hardware e Plotters de Engenharia'),
('tec-4', 'Diego Silveira', 'diego.ti@maximoaldana.com.br', 'Controle de Acesso e CFTV')
ON CONFLICT (id) DO NOTHING;
