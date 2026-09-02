export const MOCK_OBRAS = [
  {
    id: 'loc-1',
    nome: 'Sede Corporativa (São Paulo - SP)',
    cidade: 'São Paulo - SP',
    engenheiro: 'Roberto Sales (Coord. TI)',
    status: 'Operação Total',
    progresso: 100,
    chamadosAbertos: 2,
    codigoQr: 'LOC-SEDE-CORP-SP'
  },
  {
    id: 'loc-2',
    nome: 'Obra Residencial Aldana Tower',
    cidade: 'Santo André - SP',
    engenheiro: 'Eng. Carlos Eduardo',
    status: 'Contêiner de TI Ativo',
    progresso: 75,
    chamadosAbertos: 3,
    codigoQr: 'LOC-[#ALDANA-TOWER-TI]'
  },
  {
    id: 'loc-3',
    nome: 'Obra Edifício Grand Ville',
    cidade: 'São Bernardo do Campo - SP',
    engenheiro: 'Engª. Mariana Costa',
    status: 'Link Starlink / Mesh',
    progresso: 42,
    chamadosAbertos: 2,
    codigoQr: 'LOC-[#GRAND-VILLE-TI]'
  },
  {
    id: 'loc-4',
    nome: 'Obra Parque das Orquídeas',
    cidade: 'São Caetano do Sul - SP',
    engenheiro: 'Eng. Fernando Silva',
    status: 'Rede 4G Canteiro',
    progresso: 94,
    chamadosAbertos: 1,
    codigoQr: 'LOC-[#ORQUIDEAS-TI]'
  }
];

export const MOCK_CATEGORIAS = [
  { id: 'cat-1', nome: 'Hardware & Computadores', slaHoras: 12, cor: '#66C1BF', descricao: 'Notebooks, Desktops, Monitores, Nobreaks e Periféricos de engenharia.' },
  { id: 'cat-2', nome: 'Redes & Conectividade de Obra', slaHoras: 4, cor: '#E16666', descricao: 'Links Starlink/4G, Roteadores Wi-Fi, Switches, VPN e Cabeamento de Contêiner.' },
  { id: 'cat-3', nome: 'Sistemas, ERP & E-mail', slaHoras: 8, cor: '#8E7CF8', descricao: 'Microsoft 365, Sienge ERP, AutoCAD, Revit, Senhas e Acessos.' },
  { id: 'cat-4', nome: 'Impressoras & Plotters', slaHoras: 16, cor: '#E2B552', descricao: 'Plotters de Engenharia, Impressoras Multifuncionais de Canteiro, Toners.' },
  { id: 'cat-5', nome: 'Segurança, CFTV & Catracas', slaHoras: 6, cor: '#43C486', descricao: 'Câmeras de monitoramento de obra, Catracas Biométricas e Antivírus.' }
];

export const MOCK_TECNICOS = [
  { id: 'tec-1', nome: 'Lucas Oliveira', especialidade: 'Redes de Obra & Infraestrutura', email: 'lucas.ti@maximoaldana.com.br' },
  { id: 'tec-2', nome: 'Rafael Santos', especialidade: 'ERP Sienge, M365 & Sistemas', email: 'rafael.santos@maximoaldana.com.br' },
  { id: 'tec-3', nome: 'Bruno Carvalho', especialidade: 'Suporte a Hardware & Notebooks', email: 'bruno.carvalho@maximoaldana.com.br' },
  { id: 'tec-4', nome: 'Juliana Costa', especialidade: 'CFTV, Catracas & Segurança', email: 'juliana.costa@maximoaldana.com.br' }
];

export const MOCK_CHAMADOS = [
  {
    id: 'MA-TI-2026-0842',
    titulo: 'Queda do Link Starlink no Contêiner de Engenharia',
    descricao: 'A internet do contêiner da obra Aldana Tower caiu completamente. Roteador piscando em vermelho. Engenheiros sem acesso ao ERP.',
    obraId: 'loc-2',
    obraNome: 'Obra Residencial Aldana Tower',
    localizacao: 'Contêiner de Engenharia - Setor TI',
    categoriaId: 'cat-2',
    categoriaNome: 'Redes & Conectividade de Obra',
    prioridade: 'Crítica',
    status: 'Em Atendimento',
    solicitante: 'Eng. Carlos Eduardo',
    tecnicoAtribuido: 'Lucas Oliveira',
    dataCriacao: '2026-09-02 07:30',
    prazoSla: '2026-09-02 11:30',
    qrCodeItem: 'TI-ROTEADOR-STARLINK-01',
    historico: [
      { data: '2026-09-02 07:30', autor: 'Eng. Carlos Eduardo', texto: 'Chamado aberto via QR Code do roteador do contêiner.' },
      { data: '2026-09-02 07:45', autor: 'Lucas Oliveira', texto: 'Identificado reinício da fonte PoE. Acessando painel remoto para reconfiguração da VPN.' }
    ]
  },
  {
    id: 'MA-TI-2026-0841',
    titulo: 'Solicitação de Notebook i7 com Licença AutoCAD / Revit',
    descricao: 'Configurar notebook de alta performance para o novo engenheiro calculista de estruturas.',
    obraId: 'loc-1',
    obraNome: 'Sede Corporativa (São Paulo - SP)',
    localizacao: '2º Andar - Sala de Engenharia',
    categoriaId: 'cat-1',
    categoriaNome: 'Hardware & Computadores',
    prioridade: 'Média',
    status: 'Em Atendimento',
    solicitante: 'Roberto Sales (Coord. TI)',
    tecnicoAtribuido: 'Bruno Carvalho',
    dataCriacao: '2026-09-01 14:00',
    prazoSla: '2026-09-02 14:00',
    qrCodeItem: 'TI-NOTEBOOK-DELL-G15-09',
    historico: [
      { data: '2026-09-01 14:00', autor: 'Roberto Sales', texto: 'Aprovada liberação pela diretoria.' },
      { data: '2026-09-01 16:30', autor: 'Bruno Carvalho', texto: 'Formatação concluída, instalando licenças corporativas do Revit e AutoCAD 2026.' }
    ]
  },
  {
    id: 'MA-TI-2026-0840',
    titulo: 'Impressora Plotter HP de Plantas travando papel',
    descricao: 'Plotter de impressão de projetos arquitetônicos apresentando erro de alinhamento e atolamento de papel A0.',
    obraId: 'loc-3',
    obraNome: 'Obra Edifício Grand Ville',
    localizacao: 'Escritório de Campo - Sala de Desenhos',
    categoriaId: 'cat-4',
    categoriaNome: 'Impressoras & Plotters',
    prioridade: 'Alta',
    status: 'Aguardando Peça',
    solicitante: 'Engª. Mariana Costa',
    tecnicoAtribuido: 'Bruno Carvalho',
    dataCriacao: '2026-09-01 10:15',
    prazoSla: '2026-09-02 02:15',
    qrCodeItem: 'TI-PLOTTER-HP-T520',
    historico: [
      { data: '2026-09-01 10:15', autor: 'Engª. Mariana Costa', texto: 'Erro impede impressão de plantas atualizadas para a equipe de fundação.' },
      { data: '2026-09-01 15:00', autor: 'Bruno Carvalho', texto: 'Troca de rolete tracionador necessária. Solicitada peça na assistência técnica HP.' }
    ]
  },
  {
    id: 'MA-TI-2026-0839',
    titulo: 'Reset de Senha do ERP Sienge e E-mail M365',
    descricao: 'Usuário bloqueou a senha após 3 tentativas incorretas ao tentar autorizar pedidos de compra.',
    obraId: 'loc-4',
    obraNome: 'Obra Parque das Orquídeas',
    localizacao: 'Almoxarifado de Obra',
    categoriaId: 'cat-3',
    categoriaNome: 'Sistemas, ERP & E-mail',
    prioridade: 'Média',
    status: 'Concluído',
    solicitante: 'Marcos M. (Almoxarife)',
    tecnicoAtribuido: 'Rafael Santos',
    dataCriacao: '2026-09-01 08:30',
    prazoSla: '2026-09-01 16:30',
    qrCodeItem: 'TI-USUARIO-MMENDES',
    historico: [
      { data: '2026-09-01 08:30', autor: 'Marcos M.', texto: 'Solicitação via aplicativo mobile.' },
      { data: '2026-09-01 09:00', autor: 'Rafael Santos', texto: 'Senha temporária enviada via SMS corporativo. Acesso reestabelecido.' }
    ]
  },
  {
    id: 'MA-TI-2026-0838',
    titulo: 'Catraca Biométrica dos Operários sem sincronização de dados',
    descricao: 'Os registros de ponto da catraca de entrada da obra não estão subindo para o servidor de RH.',
    obraId: 'loc-2',
    obraNome: 'Obra Residencial Aldana Tower',
    localizacao: 'Portaria Principal de Obra',
    categoriaId: 'cat-5',
    categoriaNome: 'Segurança, CFTV & Catracas',
    prioridade: 'Alta',
    status: 'Concluído',
    solicitante: 'Sérgio Nogueira (Segurança)',
    tecnicoAtribuido: 'Juliana Costa',
    dataCriacao: '2026-08-31 16:00',
    prazoSla: '2026-09-01 00:00',
    qrCodeItem: 'TI-CATRACA-HENRY-02',
    historico: [
      { data: '2026-08-31 16:00', autor: 'Sérgio Nogueira', texto: 'Catraca funcionando localmente mas offline na rede.' },
      { data: '2026-08-31 17:30', autor: 'Juliana Costa', texto: 'Cabo de rede re-crimpado e IP estático redefinido no concentrador.' }
    ]
  }
];

export const MOCK_TERMOS_NOTEBOOKS = [
  {
    id: 'TERMO-2026-01',
    colaborador: 'Eng. Carlos Eduardo',
    cargo: 'Engenheiro Residente',
    equipamento: 'Dell G15 i7 - 32GB RAM',
    patrimonio: 'MA-TI-NB-084',
    dataEntrega: '2026-01-15',
    status: 'Assinado Digitalmente'
  },
  {
    id: 'TERMO-2026-02',
    colaborador: 'Engª. Mariana Costa',
    cargo: 'Engenheira de Planejamento',
    equipamento: 'MacBook Air M2 - 16GB',
    patrimonio: 'MA-TI-NB-091',
    dataEntrega: '2026-03-10',
    status: 'Assinado Digitalmente'
  }
];
