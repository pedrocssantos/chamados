// IT Helpdesk Dataset - Construtora Maximo Aldana

export const MOCK_OBRAS = [
  {
    id: 'loc-1',
    nome: 'Sede Corporativa (São Paulo - SP)',
    tipo: 'Sede Administrativa',
    cidade: 'São Paulo - SP',
    engenheiro: 'Roberto Sales (Coord. Geral)',
    progresso: 100,
    chamadosAbertos: 1,
    status: 'Operacional',
    codigoQr: 'LOC-[#SEDE-MATRIZ-TI]'
  },
  {
    id: 'loc-2',
    nome: 'Obra Residencial Aldana Tower',
    tipo: 'Edifício Residencial',
    cidade: 'Santo André - SP',
    engenheiro: 'Eng. Carlos Eduardo',
    progresso: 65,
    chamadosAbertos: 2,
    status: 'Operacional',
    codigoQr: 'LOC-[#ALDANA-TOWER-TI]'
  },
  {
    id: 'loc-3',
    nome: 'Obra Edifício Grand Ville',
    tipo: 'Edifício Comercial',
    cidade: 'São Bernardo do Campo - SP',
    engenheiro: 'Engª. Mariana Costa',
    progresso: 40,
    chamadosAbertos: 1,
    status: 'Operacional',
    codigoQr: 'LOC-[#GRAND-VILLE-TI]'
  },
  {
    id: 'loc-4',
    nome: 'Obra Parque das Orquídeas',
    tipo: 'Condomínio Fechado',
    cidade: 'São Caetano do Sul - SP',
    engenheiro: 'Eng. Felipe Silveira',
    progresso: 85,
    chamadosAbertos: 0,
    status: 'Operacional',
    codigoQr: 'LOC-[#ORQUIDEAS-TI]'
  }
];

export const MOCK_CATEGORIAS = [
  { id: 'cat-1', nome: 'Hardware e Computadores', slaHoras: 12, cor: '#66C1BF', descricao: 'Notebooks, Desktops, Monitores, Nobreaks e Periféricos de engenharia.' },
  { id: 'cat-2', nome: 'Redes e Conectividade de Obra', slaHoras: 4, cor: '#E16666', descricao: 'Links Starlink/4G, Roteadores Wi-Fi, Switches, VPN e Cabeamento de Contêiner.' },
  { id: 'cat-3', nome: 'Sistemas e ERP Sienge', slaHoras: 8, cor: '#8E7CF8', descricao: 'Microsoft 365, Sienge ERP, AutoCAD, Revit, Senhas e Acessos.' },
  { id: 'cat-4', nome: 'Impressoras e Plotters', slaHoras: 16, cor: '#E2B552', descricao: 'Plotters de Engenharia, Impressoras Multifuncionais de Canteiro, Toners.' },
  { id: 'cat-5', nome: 'Segurança e Catracas', slaHoras: 6, cor: '#43C486', descricao: 'Câmeras de monitoramento de obra, Catracas Biométricas e Antivírus.' }
];

export const MOCK_TECNICOS = [
  { id: 'tec-1', nome: 'Lucas Oliveira', especialidade: 'Redes de Obra e Infraestrutura', email: 'lucas.ti@maximoaldana.com.br' },
  { id: 'tec-2', nome: 'Rafael Santos', especialidade: 'ERP Sienge e Sistemas', email: 'rafael.santos@maximoaldana.com.br' },
  { id: 'tec-3', nome: 'Bruno Carvalho', especialidade: 'Suporte a Hardware e Notebooks', email: 'bruno.carvalho@maximoaldana.com.br' },
  { id: 'tec-4', nome: 'Juliana Costa', especialidade: 'CFTV e Controle de Acesso', email: 'juliana.costa@maximoaldana.com.br' }
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
    categoriaNome: 'Redes e Conectividade de Obra',
    prioridade: 'Crítica',
    status: 'Em Atendimento',
    solicitante: 'Eng. Carlos Eduardo',
    tecnicoAtribuido: 'Lucas Oliveira',
    dataCriacao: '02/09/2026 07:30',
    prazoSla: '02/09/2026 11:30',
    qrCodeItem: 'TI-ROTEADOR-STARLINK-01',
    historico: [
      { data: '02/09/2026 07:30', autor: 'Eng. Carlos Eduardo', texto: 'Chamado aberto para suporte de rede no contêiner.' },
      { data: '02/09/2026 07:45', autor: 'Lucas Oliveira', texto: 'Identificado reinício da fonte PoE. Acessando painel remoto para reconfiguração da VPN.' }
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
    categoriaNome: 'Hardware e Computadores',
    prioridade: 'Média',
    status: 'Em Atendimento',
    solicitante: 'Roberto Sales (Coord. TI)',
    tecnicoAtribuido: 'Bruno Carvalho',
    dataCriacao: '01/09/2026 14:00',
    prazoSla: '02/09/2026 14:00',
    qrCodeItem: 'TI-NOTEBOOK-DELL-G15-09',
    historico: [
      { data: '01/09/2026 14:00', autor: 'Roberto Sales', texto: 'Aprovada liberação pela diretoria.' },
      { data: '01/09/2026 16:30', autor: 'Bruno Carvalho', texto: 'Formatação concluída, instalando licenças corporativas do Revit e AutoCAD 2026.' }
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
    categoriaNome: 'Impressoras e Plotters',
    prioridade: 'Alta',
    status: 'Aguardando Peça',
    solicitante: 'Engª. Mariana Costa',
    tecnicoAtribuido: 'Bruno Carvalho',
    dataCriacao: '01/09/2026 10:15',
    prazoSla: '02/09/2026 02:15',
    qrCodeItem: 'TI-PLOTTER-HP-T520',
    historico: [
      { data: '01/09/2026 10:15', autor: 'Engª. Mariana Costa', texto: 'Erro impede impressão de plantas atualizadas para a equipe de fundação.' },
      { data: '01/09/2026 15:00', autor: 'Bruno Carvalho', texto: 'Troca de rolete tracionador necessária. Solicitada peça na assistência técnica HP.' }
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
    categoriaNome: 'Sistemas e ERP Sienge',
    prioridade: 'Média',
    status: 'Concluído',
    solicitante: 'Marcos M. (Almoxarife)',
    tecnicoAtribuido: 'Rafael Santos',
    dataCriacao: '01/09/2026 08:30',
    prazoSla: '01/09/2026 16:30',
    qrCodeItem: 'TI-USUARIO-MMENDES',
    historico: [
      { data: '01/09/2026 08:30', autor: 'Marcos M.', texto: 'Solicitação via aplicativo mobile.' },
      { data: '01/09/2026 09:00', autor: 'Rafael Santos', texto: 'Senha temporária enviada via SMS corporativo. Acesso reestabelecido.' }
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
    categoriaNome: 'Segurança e Catracas',
    prioridade: 'Alta',
    status: 'Concluído',
    solicitante: 'Sérgio Nogueira (Segurança)',
    tecnicoAtribuido: 'Juliana Costa',
    dataCriacao: '31/08/2026 16:00',
    prazoSla: '01/09/2026 00:00',
    qrCodeItem: 'TI-CATRACA-HENRY-02',
    historico: [
      { data: '31/08/2026 16:00', autor: 'Sérgio Nogueira', texto: 'Catraca funcionando localmente mas offline na rede.' },
      { data: '31/08/2026 17:30', autor: 'Juliana Costa', texto: 'Cabo de rede re-crimpado e IP estático redefinido no concentrador.' }
    ]
  }
];
