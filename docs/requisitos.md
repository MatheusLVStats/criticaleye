# Round Estruturado – CTI Neurológico

Proposta para discussão com a chefia · Matheus Barros · 27/10/2026 · cópia do relatório mantido no Claude

## 1. Resumo

Proposta: o CriticalEye, um round estruturado, atualizado a cada plantão, que garanta datas de dispositivos, continuidade das condutas e passagem de plantão rápida. Antes de construir qualquer ferramenta, precisamos de cinco decisões da chefia:

1. **Onde os dados ficam** (LGPD) — seção 3.
2. **Qual ferramenta** (planilha simplificada ou app local) — seção 4.
3. **Quem preenche e quando** — seção 5.
4. **Quais campos entram no round** — seção 6 (marcar Manter, Ajustar ou Retirar em cada item).
5. **Piloto**: duração e indicador de sucesso — seção 7.

Base da proposta: análise de 18 rounds de outro CTI (CTI II, jul–out/2026), usados como referência, não como modelo definitivo. Nenhum dado de paciente foi copiado para este documento.

## 2. O que aprendemos com o modelo do CTI II

O modelo tem boa estrutura. As falhas que se repetem vêm do texto livre copiado de um dia para o outro, e todas podem ser prevenidas com campos datados, obrigatórios e zerados na alta.

### Pontos fortes a manter

- Estrutura fixa por leito, igual todos os dias: quem chega sabe onde procurar.
- Dispositivos e antibióticos com data de início (D0) e histórico de antibióticos já feitos, com período.
- Tendência "anterior > atual" para exames, gasometria, diurese, balanço hídrico e drenos.
- Conduta numerada, seções próprias para culturas e protocolos (ex.: sepse com foco e data).
- Decisões de cuidados paliativos registradas por escrito.

### Falhas observadas e como o novo modelo previne

Exemplos anonimizados, retirados dos 18 rounds analisados.

| Falha | Exemplo observado | Como o modelo previne |
| --- | --- | --- |
| Dispositivo sem data | Sonda vesical, SNE e acesso periférico sem data na maioria dos leitos; datas como "00/07", "?/?", "(?)" | Data de inserção obrigatória para salvar |
| Dias de dispositivo contados à mão | Só a data é registrada; quem lê precisa calcular | Contador automático (D12) com cor ao passar do limite definido com a CCIH |
| Dados herdados do paciente anterior do leito | Alergia, comorbidades e medicações de uso contínuo idênticas às do ocupante anterior; mesmo número de prontuário; idade 50 anos com nascimento em 1943 | Na alta, o leito é zerado; o novo paciente começa em branco |
| Identificação inconsistente | Data de nascimento igual à data de internação; nascimento em 2026 para paciente de 20 anos | Idade calculada pela data de nascimento; datas impossíveis bloqueadas |
| Resultados "congelados" | Mesmos exames e mesma gasometria repetidos por 7 dias, sem data de coleta | Todo resultado tem data; valor antigo aparece esmaecido |
| Conduta que não fecha | "Aguarda reunião" e "solicitada transferência" repetidos por 4 a 8 dias; numeração duplicada; conduta contradiz outro campo ("retorna enoxaparina" com anticoagulação "suspensa") | Pendências com status (aberta ou feita) e data; cada informação vive em um só campo |
| Laudos colados na íntegra | Laudos de TC com 10 a 20 linhas por exame, repetidos todo dia | Data, exame e conclusão em uma linha; laudo completo fica no sistema do hospital |
| Lista fixa de 30 exames | Maioria dos campos com "---" todos os dias | Mostrar só exames com resultado |
| Erros de digitação | Antibiótico com início "24/04" em agosto; bicarbonato "2,4" com pH normal | Campos de data e número com validação |
| Alertas espalhados no texto | Isolamento (VRE, ERC), paciente custodiado, não identificado e limitação de suporte aparecem soltos | Faixa de alertas no topo de cada leito |
| Seções quase sempre vazias | LPP e Protocolos em branco na maioria dos dias | Rever se entram; se sim, com opções para marcar, não para escrever |

Um efeito colateral prático: laudos completos e listas fixas deixam o arquivo pesado, o que contribui para o LibreOffice travar. Um round mais curto já resolve parte do problema de desempenho.

## 3. Armazenamento e proteção de dados (LGPD)

A LGPD não proíbe o round digital. Ela exige que o hospital decida onde os dados ficam, quem acessa e como são protegidos. Por isso, a escolha entre drive, rede interna ou papel precisa passar pela TI e pelo encarregado de dados do hospital, não só pelo CTI.

### O que a lei pede

- Dado de saúde é dado pessoal sensível (art. 5º, II).
- Não é preciso consentimento do paciente: a base legal é a tutela da saúde, em procedimento feito por profissionais ou serviços de saúde (art. 11, II, "f").
- Quem trata os dados deve adotar medidas de segurança contra acesso não autorizado, perda e vazamento (art. 46), desde a concepção da ferramenta (art. 46, § 2º).
- Só o mínimo necessário para a finalidade (art. 6º, III): o round não precisa de CPF, endereço ou nome da mãe.

O round é ferramenta de trabalho e não substitui o prontuário, que o CFM define como documento único do paciente (Res. CFM 1.638/2002). Toda conduta decidida no round precisa constar na evolução.

### Opções comparadas

| Opção | Onde ficam os dados | A favor | Contra | Condição para usar |
| --- | --- | --- | --- | --- |
| Drive em conta pessoal | Nuvem, na conta de um médico | Grátis, edição simultânea | Hospital não controla quem acessa; links compartilháveis; acesso continua após a saída da pessoa | Não recomendado |
| Drive institucional (conta do hospital) | Nuvem contratada pelo hospital | Edição simultânea, histórico de versões, roda no navegador | Depende de internet e de contrato | Aprovação do encarregado e da TI; só contas institucionais; sem compartilhamento por link |
| Pasta na rede interna + arquivo ou app local | Servidor do hospital | Dados não saem do hospital; funciona sem internet | Edição simultânea só em leitos diferentes; backup depende da TI | Pasta restrita à equipe do CTI, com backup |
| Papel ou quadro | No leito ou no posto | Nenhuma dependência de TI | Sem histórico; quadro exposto a visitantes | Plano B para queda de sistema |

### Lição de um caso real

Em janeiro de 2026, dados de pacientes de hospitais públicos do Ceará foram encontrados em blocos de notas online sem senha. Os profissionais recorriam a eles porque o sistema oficial era lento e instável. A lição para nós: a ferramenta precisa ser segura e rápida ao mesmo tempo, senão a equipe improvisa.

### Perguntas para levar à TI e ao encarregado de dados

- [ ] O hospital tem conta institucional (Google Workspace ou Microsoft 365)? A proposta do drive seria nela?
- [x] Existe pasta de rede restrita ao CTI, com backup?
- [ ] Quem é o encarregado de dados do hospital?
- [x] Os computadores do CTI permitem instalar programas ou só usar o navegador? Qual navegador e versão?
- [ ] Round impresso: onde fica durante o plantão e como é descartado (fragmentadora)?
- [x] Dá para criar uma pasta por CTI, com subpastas por posto, e liberar cada uma só para os usuários de rede daquela unidade?
- [ ] Para onde vão os PDFs baixados do sistema? Dá para direcioná-los a uma pasta de entrada do round, de onde o app apaga cada arquivo depois de importar?
- [ ] Dá para colocar o atalho do app na Área de Trabalho Pública dos computadores do CTI 1 e do CTI 2, para aparecer em todos os perfis do Windows?
- [ ] Dá para mapear a pasta de cada CTI como unidade de rede (ex.: R:) em todos os perfis?
- [x] Os funcionários do administrativo têm usuário de rede com acesso à pasta do CTI? Sim, já têm.
- [ ] Na prescrição, o que significa o "de N" em "D (x / y) de N" dos antimicrobianos? (vale perguntar também à farmácia)

## 4. Requisitos da ferramenta (app)

Proposta: um único arquivo que abre no navegador do computador do CTI, sem internet e sem servidor, salvando os dados numa pasta da rede interna. É mais leve que o LibreOffice e não depende de licença.

| Requisito | Proposta |
| --- | --- |
| Instalação | Um app só, numa pasta comum da rede (só leitura; a TI troca o arquivo quando houver versão nova), com atalho colocado pela TI na Área de Trabalho Pública de cada computador (C:\\Users\\Public\\Desktop), que aparece em todos os perfis do Windows: ninguém precisa criar atalho, e não exige permissão de administrador. Na primeira vez em cada perfil do Windows, o app mostra um passo guiado para conectar a pasta do CTI (mais fácil se a TI mapear a pasta como unidade de rede, ex.: R:); depois o app lembra, e o navegador no máximo pede para confirmar o acesso |
| Requisito técnico | Chrome ou Edge versão 86 ou mais recente; no início de cada sessão, o navegador pede para autorizar a pasta do round |
| Onde ficam os dados | Uma pasta por CTI na rede do hospital, com uma subpasta por posto e, dentro dela, uma por dia. Nome, cor, leitos e postos do CTI ficam num arquivo de configuração dentro da própria pasta, iguais em todos os computadores (seção 3) |
| Vários CTIs | O hospital tem 5 CTIs adultos; na fase de testes, só o CTI 1 e o CTI 2 usam o app. Na entrada, o médico escolhe o CTI e o posto. Quem controla o acesso é a permissão da pasta de rede (a TI libera cada CTI só para os usuários daquela equipe); a entrada é pelo CRM (ex.: 521234567), de qualquer tamanho: CRMs antigos têm 4 ou 5 dígitos, e o app aceita todos. No primeiro acesso, a pessoa cadastra nome e último nome, uma vez por CTI; depois basta o CRM. A cada entrada ela escolhe se está como rotina ou plantonista, porque a mesma pessoa pode ter papéis diferentes em CTIs diferentes; nome e papel aparecem em "última edição por". O CRM identifica, mas não é senha (é público); se a chefia quiser, dá para pedir um PIN de 4 dígitos no primeiro acesso. O administrativo entra pelo botão "Entrar como ADM", sem matrícula (a confirmar com a chefia), com perfil ADM: lança laboratório, gasometria, laudos e sinais das últimas 24 h, e vê as demais seções só para leitura; o que ele lança aparece como "lançado pelo ADM", com data e hora. Senha dentro do app, sozinha, não protege os arquivos: quem abre a pasta lê os dados sem passar pelo app |
| Postos | CTI 1 (neurológico): 20 leitos em dois postos. Posto 1: leitos 1 a 5 e 16 a 20; posto 2: leitos 6 a 15. Cada posto tem o seu round do dia, mapa e impressão. Os leitos 1 e 20 são de isolamento, podem receber pacientes clínicos e aparecem marcados no mapa. CTI 2 (pós-operatório): 10 leitos, sem postos, um round por dia. Leitos e postos são configuráveis para os outros CTIs |
| Uso simultâneo | Cada leito é salvo em arquivo próprio: rotina e plantonista editam leitos diferentes ao mesmo tempo. O mesmo leito fica reservado para quem abriu primeiro; o outro vê em modo leitura. Alterações aparecem nos demais computadores em poucos segundos |
| Tempo real completo (opcional) | Ver o colega digitando, como no Google Docs, exige um pequeno servidor na rede do hospital; depende da TI |
| Round diário | Cada posto tem um round por dia, guardado na pasta do dia. Ao abrir o dia novo, o app copia todos os pacientes do round anterior, menos os que tiveram saída registrada, e acrescenta em branco as admissões do dia anterior. Vem copiado o que permanece (identificação, diagnósticos, alertas, dispositivos e antibióticos com um dia a mais, culturas, protocolos, cuidados paliativos, pendências abertas); o "atual" de laboratório, gasometria e balanço passa a "anterior"; exame neurológico, infusões e ventilação vêm para conferir; últimas 24 h começam vazias; o plano do dia começa em branco, com botão para copiar o de ontem. Dias passados ficam só para consulta |
| Saída do CTI | Alta, óbito ou transferência registrados no próprio dia pelo botão "Saída do CTI", com data, hora e destino. O leito fica marcado no mapa e não entra no round seguinte; se foi engano, dá para desfazer na abertura do dia |
| Interface | Fundo claro, uma cor por CTI, para ninguém confundir em qual está (CTI 1 em tons de azul, CTI 2 em tons de verde), âmbar para atenção e vermelho só para alerta crítico e lilás para cuidados paliativos, iguais em todos os CTIs; fonte grande e alto contraste |
| Layout | Identificação no canto superior esquerdo, como no modelo do CTI II; as demais seções sempre na mesma posição |
| Interface limpa | Seção vazia mostra só um botão "+" que abre as opções (ex.: profilaxias); nada de caixas de sim ou não. Visualização resumida por padrão: ficam abertos só identificação com alertas, diagnósticos, dispositivos, antibióticos e culturas, plano e pendências; as demais seções ficam fechadas numa linha de resumo e abrem com um clique. Quem quiser usa a visualização completa. Nenhuma escala é obrigatória; onde a equipe não usa escala, o campo vem em palavras simples |
| Nome do hospital e da unidade | Configuráveis em uma tela de ajustes; aparecem na barra superior e no cabeçalho de cada página impressa, para o mesmo app servir a outras unidades |
| Nome e identidade visual | CriticalEye, "Cada paciente, um olhar atento." Logo do olho e azul-marinho da marca (#01234F) com branco. O logo completo aparece na entrada; o ícone do olho, na barra superior e no atalho. O CTI 1 usa o azul-marinho da marca; o CTI 2 continua verde. Antes de registrar a marca no INPI, fazer a busca de anterioridade: já existe uma empresa britânica chamada Criticaleye, de outra área (rede de executivos) |
| Navegação | Mapa da unidade com os 10 leitos de cada posto e seus alertas (no CTI 1, 20 leitos em dois postos); um clique abre o leito, sempre com as seções na mesma ordem |
| Importar PDFs | Laudos de imagem, resultados de laboratório e prescrição lidos no próprio computador, sem internet: data, exame e conclusão (imagem); valores no formato anterior > atual (laboratório); antibióticos reconhecidos pela lista da CCIH (prescrição); identificação, diagnósticos, alergias, antimicrobianos com data de início, dispositivos e exames (evolução anterior ou sumário de transferência, útil nas admissões da madrugada e de outros setores; o restante do texto pode ir para a história); evoluções da comissão de cuidados paliativos, da psicologia e do serviço social (seção 6.16). O médico confere antes de salvar e descarta o que não servir. Funciona com PDF gerado pelo sistema; PDF escaneado exige leitura óptica, mais lenta. O PDF não é guardado: os dados vão para o round e o arquivo é apagado da pasta de entrada do round logo após a importação (minimização de dados, art. 6º III da LGPD). A exclusão é definitiva, porque o navegador não tem acesso à lixeira do Windows, o que é melhor para dados de paciente |
| Copiar evolução | Gera uma evolução padrão a partir do round, em texto simples para colar no prontuário: identificação, diagnósticos, comorbidades, medicações de uso contínuo (com o que foi mantido ou suspenso), dispositivos, antimicrobianos e culturas, últimas 24 h, suporte, exames, plano e pendências. O exame físico fica em branco, para o médico escrever no momento da avaliação. O médico revisa antes de colar; o modelo é ajustável com a coordenação. Formato: um item por linha em cada seção e linha em branco entre seções; só letras, números e / - : > < + %, porque símbolos como o ponto médio viram "?" ao colar no TI MED; acentos funcionam normalmente. Infusões sempre com a vazão da bomba e, entre parênteses, a dose quando houver peso e solução. Dispositivos e antimicrobianos no formato "D7 (D0 20/10 - CTI) PVP VJID": dia atual, data de início e, nos dispositivos, o local da inserção; antimicrobianos sem posologia. Vale também para a passagem de plantão |
| Passagem de plantão | Uma tela por posto, leito a leito: situação (estável, atenção, instável ou paliativo, escolhida por quem passa), resumo, alertas e pendências abertas vindos do round, e um campo livre "Atenção no plantão". Inclui as admissões e as saídas do dia. Filtro para ver só instáveis e atenção. Quem recebe confirma com o CRM; fica registrado quem passou, quem recebeu e a hora. O texto para copiar segue o formato da evolução padrão |
| Antibióticos | Importados da prescrição ou digitados; antibiótico novo recebe a data do dia e os já em uso mantêm a data de início, sempre editável |
| Doses de infusão | Peso e altura opcionais; o médico escolhe a solução padrão da casa e informa a vazão. Com peso e solução preenchidos, o app mostra a dose (ex.: mcg/kg/min); faltando dado, o campo fica em branco, sem avisos ou símbolos |
| Impressão | Versão própria para impressão, na mesma ordem da tela: A4 paisagem, preto e branco (a impressora do hospital só imprime assim; na tela o app continua colorido), sem botões e sem campos vazios. Cada leito sempre cabe em uma folha, com a letra ajustada até um mínimo legível; na opção "2 leitos por folha", cabe em meia folha, para economizar papel. Pendências saem com quadradinho para marcar à mão, e sobra um espaço para anotações do plantão. Quando o leito tem protocolo de morte encefálica aberto, a folha ganha uma seção própria logo abaixo da identificação: hora em que a sedação foi desligada e drogas, elegibilidade, exames laboratoriais, 1º e 2º exames clínicos (com horário e médico), teste de apneia e método gráfico (com fluxo residual, se houver), além do que ainda falta. Ao imprimir, escolhe-se: todos os leitos ocupados (padrão; os vagos ficam de fora), só o leito aberto ou leitos escolhidos; só campos preenchidos aparecem; alertas marcados por ícone e negrito, para sair legível em impressora preto e branco, sem áreas pintadas de preto ou cinza, para economizar tinta (alergia com borda dupla e ícone, não tarja preta) |
| Rodapé impresso | Data, hora e "Documento interno com dados sensíveis. Descartar em fragmentadora." |
| Limite de segurança clínica | Sem sugestões de conduta nem de dose a prescrever; o app só calcula a partir do que o médico informou (dias, idade, PPC, dose da infusão) |

### O que faz o plantonista querer usar

- Dias de dispositivo e de antibiótico contados sozinhos.
- Texto da passagem de plantão gerado com um clique, pronto para colar na evolução.
- Evolução padrão gerada com um clique, só faltando o exame físico.
- Pendências com caixa de marcar: o que foi feito sai da lista.
- Laudos, exames e antibióticos importados dos PDFs, sem redigitar.

### Decisões da chefia

- [ ] Leito aberto por outro médico: o segundo espera ou pode assumir após alguns minutos sem atividade?
- [ ] Imprimir em todo plantão ou só no round da manhã?
- [ ] Vale pedir à TI um pequeno servidor local para tempo real completo?
- [ ] Acesso: só a escolha de CTI e posto, com a permissão das pastas feita pela TI, ou também uma senha por CTI?
- [ ] No dia novo, exame neurológico, infusões e ventilação vêm copiados para conferir ou começam vazios?
- [ ] Evolução padrão: modelo, ordem das seções e se o título "Exame físico" vai em branco no texto (com a coordenação).
- [ ] Entrada: só o CRM basta ou pedir também um PIN de 4 dígitos?
- [ ] ADM: além de laboratório, gasometria, laudos e sinais das 24 h, também lança resultados de culturas?
- [ ] ADM: entrar só pelo botão "Entrar como ADM" (mais simples, mas sem saber quem lançou) ou com matrícula (identifica quem lançou, se houver erro)?

## 5. Rotina: quem preenche e quando

O round só se mantém com dono e horário definidos. Médicos preenchem o round; o administrativo (entrada ADM) lança exames e os sinais das últimas 24 h. Balanço hídrico, dispositivos e as demais seções ficam com os médicos. Cada dia tem o seu round. Proposta para discussão, com meta de 2 a 3 minutos por leito no round da manhã:

1. **Abertura do round do dia** — em cada posto, quem chegar primeiro (médico ou ADM) abre o dia; o app copia os pacientes do round anterior, tira os que tiveram saída e acrescenta em branco as admissões do dia anterior.
2. **Admissões** — pacientes admitidos ao longo do dia entram no round do dia seguinte.
3. **Round da manhã** — rotina e plantonista atualizam ao mesmo tempo, cada um nos seus leitos.
4. **Passagem de plantão** — quem sai atualiza o que mudou e gera o texto de passagem; quem entra confere as pendências abertas.
5. **Intercorrência ou novo dispositivo** — registrado na hora, por quem fez.
6. **Alta, óbito ou transferência** — registrado no mesmo dia pelo botão "Saída do CTI"; o leito não é copiado para o dia seguinte e o histórico fica na pasta do dia.

**Quem preenche o quê (proposta para conversar com a chefia).** Ninguém fica bloqueado de editar; a divisão só deixa claro de quem é cada parte, para ninguém se sentir sobrecarregado.

| Parte do round | Quem preenche |
| --- | --- |
| Abertura do round do dia | Quem chegar primeiro: médico ou ADM |
| Exames, sinais das últimas 24 h, evacuação e pele (da folha da enfermagem) | ADM (ou médico) |
| Neurológico | Principalmente o plantonista, no exame do plantão; o quadro mostra a hora e quem examinou |
| Dispositivos e balanço hídrico | Médico |
| Identificação, diagnósticos e alertas | Quem admitiu o paciente |
| Antibióticos, culturas, plano do dia, família e paliativos | Rotina e plantonista |
| Nutrição | Médico, só a dieta (uma escolha); o resto vem da enfermagem |

### Decisões da chefia

- [ ] Quem é o responsável pelo round em cada plantão (diarista, plantonista, residente)?
- [ ] Horário fixo do round da manhã.
- [ ] Quem abre o round do dia e até que horário?
- [ ] Passagem de plantão em formato padronizado (ex.: I-PASS: gravidade, resumo, ações, contingências, síntese de quem recebe)?

## 6. Proposta seção por seção

Em cada linha, a chefia escolhe Manter, Ajustar ou Retirar. Itens marcados (novo) não existem no modelo do CTI II; (neuro) são específicos do CTI neurológico. Campos "automáticos" são calculados pelo app, ninguém digita.

### 6.1 Faixa de alertas no topo do leito (novo)

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Alergias | Medicamento e reação; "nega" só se confirmado com paciente ou família; nunca herdado do leito anterior |  |
| Isolamento | Tipo de precaução (contato, gotículas ou aerossóis) e o motivo: germe multirresistente (MRSA, ERC/KPC, VRE), C. difficile, tuberculose, COVID-19, influenza, VSR, varicela, sarampo ou outro; data de início, exame que confirma e critério de liberação definido pela CCIH |  |
| Nível de suporte | Pleno, cuidados proporcionais ou conforto exclusivo, com data e com quem foi decidido; vem da seção 6.16 (cuidados paliativos) e aparece em lilás no topo do leito e no mapa da unidade |  |
| Situações especiais | Custodiado; não identificado (nome provisório padronizado); risco de broncoaspiração |  |

### 6.2 Identificação

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Leito e datas | Leito, internação hospitalar e admissão no CTI; dias de CTI automáticos |  |
| Paciente | Nome completo ou iniciais (decidir), prontuário, data de nascimento com idade automática |  |
| Peso e altura | Opcionais, real ou estimado; com peso e solução informados, o app calcula a dose das infusões |  |
| Origem e equipe | De onde veio (emergência, centro cirúrgico, enfermaria, outro hospital) e equipe cirúrgica responsável |  |
| Funcionalidade prévia (neuro) | Situação antes da internação, em palavras simples (independente; independente com alguma limitação; precisava de ajuda no dia a dia; acamado), opcional e sem escala |  |

### 6.3 Diagnósticos e história

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Diagnóstico principal | Uma linha, com data do ictus ou do trauma; dia pós-ictus automático (neuro) |  |
| Procedimentos | Lista com data, mais recente no topo; dia de pós-operatório automático |  |
| Comorbidades e uso contínuo | Lista, com marcação de reconciliação medicamentosa feita |  |
| História (HDA) | Resumo de até 3 linhas; o texto completo fica no prontuário |  |

### 6.4 Neurológico (novo, neuro)

Seção opcional por leito: vem ligada no CTI 1 e desligada no CTI 2 (pós-operatório). Na admissão, o médico liga ou desliga em "Seções deste leito", e a escolha segue nos rounds seguintes. No CTI 1, desliga-se para paciente clínico (os leitos 1 e 20 são de isolamento e recebem clínicos); no CTI 2, liga-se para paciente neurológico admitido por falta de vaga no CTI 1.

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Exame neurológico | Glasgow (ou FOUR se intubado), RASS e meta de RASS, pupilas (tamanho, simetria, fotorreação), déficit focal; situação com a neurocirurgia (em acompanhamento desde, conduta conservadora definida em, alta da neurocirurgia em, ou não acompanhado) |  |
| Gravidade na admissão | Valor digitado direto, com cálculo opcional; uma escala por diagnóstico: Hunt-Hess ou WFNS e Fisher modificada (HSA), ICH score (HIP), Marshall (TCE), NIHSS (AVC) |  |
| Monitorização invasiva | PIC (faixa 24 h) e PPC calculada (PAM − PIC); DVE: altura, débito 24 h e aspecto |  |
| Alvos do dia | Definidos pela equipe no round: PAS ou PAM, PPC, sódio, temperatura, glicemia |  |
| HSA | Dia pós-ictus, nimodipino (dia X de 21), Doppler transcraniano com data e conclusão |  |
| Crises e anticonvulsivantes | Droga, data de início, nível sérico com data, crise nas últimas 24 h, EEG |  |
| Terapia hiperosmolar | Solução em uso; sódio e osmolaridade com data |  |
| Restrições | Cabeceira, colar cervical, lado sem calota (craniectomia), restrição de mobilização |  |
| Protocolo de morte encefálica | Aparece só quando aberto e registra só a parte do CTI (plantão e rotina); comunicação à família, notificações e termo ficam com a CIHDOTT. Campos: data e hora em que a sedação foi desligada e quais drogas, com o tempo até a abertura do protocolo calculado pelo app; elegibilidade (se não elegível, o motivo); exames laboratoriais colhidos ou pendentes; 1º e 2º exames clínicos (data, hora, médico e resultado), com o horário mínimo do 2º calculado pelo app (1 h acima de 2 anos); teste de apneia (data, hora, PaCO₂ final e resultado; não compatível quando houve movimento respiratório); método gráfico (EEG, DTC ou outro: data, hora e resultado, inclusive fluxo residual), com espaço para um segundo método. Etapas conforme a Res. CFM 2.173/2017 |  |
| Última TC de crânio | Data e conclusão em uma linha |  |

### 6.5 Dispositivos (prioridade do projeto)

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Lista de dispositivos | Tipo, sítio, data de inserção (obrigatória) e local de inserção (CTI, centro cirúrgico, emergência, outro hospital); dias automáticos |  |
| Revisão diária | Dispositivo acima do limite de dias aparece destacado; troca programada registrada só quando houver, com motivo |  |
| Limites de dias | Cor de alerta conforme a política da CCIH (limites a definir com a CCIH) |  |
| Drenos | Tipo, local, débito 24 h e aspecto; só os 3 últimos valores, não a série inteira |  |

### 6.6 Hemodinâmica, sedação e função renal

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Drogas vasoativas | Droga (lista do app Ronda CTI: noradrenalina, vasopressina, dobutamina, dopamina, nitroprussiato, nitroglicerina, amiodarona, fentanil, morfina, midazolam, propofol, dexmedetomidina, cisatracúrio e rocurônio), concentração final já preenchida pelo padrão do CTI e editável, e vazão em ml/h; o app mostra a dose na unidade de cada droga (mcg/kg/min, mcg/h, mg/h, UI/min), e as que dependem de peso só aparecem com peso informado; tendência |  |
| Sedação e analgesia | Drogas, solução e vazão (dose calculada como acima) e meta de RASS |  |
| Função renal | Terapia renal substitutiva: modalidade e data de início |  |

### 6.7 Últimas 24 h pela enfermagem e balanço hídrico (novo)

Bloco próprio, como no CTI II, com o que a enfermagem registrou na folha de controles. Os sinais e controles podem ser lançados pelo administrativo (entrada ADM) ou pelo médico; ganhos, perdas e balanço ficam com o médico. Se os controles existirem em PDF no sistema, o app pode importar. Período padrão de 07:00 a 07:00. Ganhos, perdas e balanço aparecem no formato dia anterior > dia atual.

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Temperatura | Máxima e número de picos, com horário |  |
| Hemodinâmica | Faixas de PAS, PAD, PAM e FC |  |
| Respiratório | Faixas de FR e SatO₂ |  |
| Glicemia capilar | Faixa 24 h e total de insulina em UI |  |
| Dor | Sem dor, dor controlada ou dor não controlada; escala só se a equipe já usar |  |
| Evacuação | Data da última; dias sem evacuar automáticos |  |
| Intercorrências | Uma linha (ex.: pico febril, DVE fechada para mobilização, extubação acidental) |  |
| Ganhos | Um campo só, com o total de ganhos já calculado pela enfermagem na folha de controles (sem separar dieta, infusões e medicações) |  |
| Perdas | Diurese (ml e ml/kg/h com peso), DVE, drenos, SNG ou vômitos, evacuações líquidas, ultrafiltração |  |
| Balanço | 24 h e acumulado desde a admissão no CTI, calculados pelo app; item sem valor não aparece |  |

Para decidir com a chefia: horário de fechamento do balanço e se entram perdas insensíveis estimadas.

### 6.8 Respiratório

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Suporte ventilatório | Ar ambiente, cateter, VNI, TOT ou TQT; parâmetros da VM (modo, PEEP, FiO2, VC) |  |
| Gasometria | Dia anterior > dia atual, com hora da coleta; P/F calculada |  |
| Desmame | Dias de VM automáticos; plano de desmame em uma linha (ex.: TRE hoje, previsão de TQT) |  |

### 6.9 Infecção

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Antibióticos em uso | Importados da prescrição em PDF ou digitados: droga da lista da CCIH, data de início (D0), dia atual automático, foco (os do protocolo da CCIH) e duração prevista; sem posologia, que fica na prescrição; os de uso restrito aparecem marcados "uso restrito · SCIH" |  |
| Antibióticos prévios | Droga e período |  |
| Culturas | Hemocultura, urocultura, secreção traqueal ou escarro, líquor, ponta de cateter: data da coleta, resultado e status (pendente, parcial, negativa, positiva com germe e sensibilidade); coleta mais recente no topo; importável do PDF do laboratório |  |
| Vigilância | Swabs (VRE, ERC, MRSA) com data; alimentam a faixa de isolamento |  |
| Doença respiratória em investigação (TB, COVID-19, influenza, VSR) | Motivo da suspeita; exames com data e resultado (TB: GeneXpert MTB/RIF e BAAR, 1ª, 2ª e 3ª amostras; vírus respiratórios: RT-PCR, teste de antígeno ou painel viral); o isolamento entra na faixa de alertas até ser liberado; para TB, o app mostra a regra de saída da CCIH (2 BAAR negativas em escarro espontâneo, ou 1 em escarro induzido ou lavado broncoalveolar, ou 14 dias de RHZE) |  |
| Protocolos de sepse | Histórico de todos os protocolos da internação, mesmo os encerrados: data e hora de abertura, foco, antibiótico iniciado e status (em tratamento, encerrado, descartado). Leito com protocolo em curso aparece marcado no mapa da unidade |  |

### 6.10 Profilaxias e medicações-chave

Na tela, a seção começa vazia, com um botão "+" que abre estas opções; só o que for escolhido aparece e é impresso.

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Tromboprofilaxia | Química, mecânica ou contraindicada (motivo e data de reavaliação); ponto sensível após neurocirurgia (neuro) |  |
| Profilaxia de úlcera de estresse | Registrada só quando em uso, com indicação |  |
| Anticoagulação plena e antiagregação | Droga, dose e indicação; suspensão com motivo |  |
| Corticoide | Droga, dose, indicação e plano de desmame |  |

### 6.11 Nutrição e trato gastrointestinal

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Dieta | Via, vazão, meta calórica e % atingida; motivo, se dieta zero |  |
| Deglutição | Avaliação da fonoaudiologia, com data |  |

### 6.12 Exames

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Laboratório | Painel fixo com os exames principais (Hb, leucócitos, plaquetas, PCR, INR, Na, K, Mg, ureia, creatinina, lactato) com data; demais só quando colhidos; formato anterior > atual; importável do PDF do laboratório |  |
| Imagens e outros | Data, exame e conclusão em uma linha, importáveis do PDF do laudo; pendentes marcados (solicitado, aguarda laudo) |  |

### 6.13 Pele

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Lesão por pressão | Local e estágio; risco pela escala usada pela enfermagem; lançado pelo ADM a partir da folha da enfermagem |  |

### 6.14 Plano e pendências (substitui "Conduta")

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Plano do dia | Caixa de texto livre, porque a equipe costuma copiar e colar o plano anterior. Opcionais: botão "Copiar o plano de ontem", para revisar e atualizar, e tópicos por sistema para quem quiser organizar |  |
| Pendências | Item, responsável, data e status (aberta ou feita); as feitas saem da lista no dia seguinte |  |
| Aguardando | Cirurgia, parecer, exame ou vaga, com data do pedido |  |

### 6.15 Família e destino

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Comunicação com a família | Data da última conversa, com quem e decisões tomadas |  |
| Previsão de alta | Critérios pendentes e destino (enfermaria, outra unidade) |  |

### 6.16 Cuidados paliativos (novo)

Sem discussão em curso, a seção ocupa uma linha ("Sem limitação de suporte") e o botão "+" abre as opções. Quando há discussão, cada decisão vira uma etiqueta com data, sem caixas de sim ou não, e alimenta o nível de suporte no topo do leito, o mapa da unidade e a passagem de plantão. O registro oficial continua no prontuário: a Res. CFM 1.805/2006 permite limitar tratamentos que prolonguem a vida na fase terminal, respeitada a vontade do paciente ou do representante legal, com a decisão registrada no prontuário; a Res. CFM 1.995/2012 trata das diretivas antecipadas de vontade. No SUS, a Política Nacional de Cuidados Paliativos (Portaria GM/MS nº 3.681/2024) prevê equipes próprias; vale confirmar com a chefia como a comissão do hospital é acionada.

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Situação | Sem limitação de suporte; aguarda avaliação ou reunião (com data); cuidados proporcionais; conforto exclusivo |  |
| Comissão de cuidados paliativos | Data em que foi acionada e data da avaliação |  |
| Reunião com a família | Data e hora, participantes e quem responde legalmente pelo paciente |  |
| Entendimento e valores | O que a família compreende do prognóstico; desejos do paciente, quando conhecidos |  |
| Diretivas antecipadas de vontade | Se existem e onde estão registradas |  |
| Decisões | Etiquetas com data: não RCP, não escalonar suporte, não iniciar ou não aumentar aminas, não hemodiálise, não escalonar antibiótico, não reintubar; extubação paliativa em discussão ou definida |  |
| Mantidos | O que segue mesmo com limitação (ex.: dieta, antibiótico atual, VM nos parâmetros atuais) |  |
| Controle de sintomas | Dor, desconforto respiratório, secreção, agitação e náusea, em palavras simples (ex.: controlada, leve, intensa), sem escala obrigatória |  |
| Próximos passos | Nova reunião, visita estendida, psicologia, serviço social, capelania; entram nas pendências |  |
| Registro no prontuário | Data da evolução em que a decisão foi registrada |  |
| Evoluções em PDF | Ao abrir a seção pela primeira vez (ou depois), dá para importar as evoluções da comissão de CP, da psicologia e do serviço social: o app sugere datas, participantes, decisões, controle de sintomas, acompanhamento e responsável familiar; o médico confere, e o PDF é apagado depois |  |

### 6.17 Cirurgia e pós-operatório (CTI 2, novo)

Proposta inicial, a validar com a chefia do CTI 2 e com a cirurgia geral. Vem ligada no CTI 2 e desligada no CTI 1, e pode ser ligada ou desligada em qualquer leito dos dois (ex.: paciente neurológico não cirúrgico no CTI 2, ou pós-operatório de cirurgia geral no CTI 1).

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Cirurgia realizada | Procedimento, data (o app conta o dia de PO), caráter (eletiva ou urgência) e equipe cirúrgica |  |
| Intraoperatório | Intercorrências: sangramento, instabilidade, hemotransfusão |  |
| Drenos | Tipo, local, data, débito e aspecto; o débito entra nas perdas do balanço |  |
| Ostomias | Tipo, data, aspecto e débito |  |
| Ferida operatória | Aspecto e curativo |  |
| Analgesia | Cateter peridural (data de inserção e solução) ou outra estratégia |  |
| Reabordagem | Data e motivo |  |
| ECOG prévio | Funcionalidade antes da internação (0 a 4), opcional, porque a equipe do CTI 2 já usa |  |
| Ataque de AAS + clopidogrel (cirurgia vascular) | Angioplastia, stent ou reconstrução arterial (ex.: lesão de artéria axilar em fratura de úmero): ataque antiagregante no pós-operatório feito ou não, onde (centro cirúrgico ou CTI), hora (opcional) e doses de AAS e clopidogrel em mg (em geral 200 mg e 300 mg, digitadas pelo médico); aparece na faixa de alertas e na passagem de plantão |  |
| Antitrombótico pós-operatório | O definido pela cirurgia vascular: anticoagulação plena, profilática, antiagregação simples ou dupla; início e até quando. O app registra; não sugere qual usar |  |
| Perfusão do membro | Pulsos distais, cor e temperatura, com a hora da última checagem |  |

### 6.18 Protocolo do idoso: fratura de fêmur (novo)

Seção opcional, ligada em "Seções deste leito" nos dois CTIs, para pacientes de 60 anos ou mais com fratura de fêmur (ortopedia). Segue o protocolo do hospital; as Diretrizes Brasileiras do Ministério da Saúde (Portaria Conjunta SAS/SCTIE nº 21/2018) recomendam operar o mais cedo possível, sem passar de 48 h, bloqueio de nervo na analgesia quando necessário, tromboprofilaxia, fisioterapia em até 48 h e avaliação multiprofissional. O app não sugere conduta: só registra e calcula o tempo até a cirurgia.

| Campo | O que registrar | Decisão |
| --- | --- | --- |
| Fratura | Data e hora da fratura ou da chegada ao hospital |  |
| Cirurgia | Data, hora e tipo (artroplastia ou osteossíntese); tempo até a cirurgia calculado pelo app |  |
| Analgesia | Analgésico simples, bloqueio de nervo ou opioide |  |
| Tromboprofilaxia | Registrada em Profilaxias, sem repetir aqui |  |
| Mobilização | Data da primeira fisioterapia ou da primeira saída do leito |  |
| Delirium | Sem delirium ou com delirium, em palavras simples |  |
| Avaliações | Geriatria, fisioterapia, nutrição e serviço social, com data |  |

### 6.19 Leitura dos PDFs do hospital

Os modelos chegaram em 30/10. O sistema do hospital gera PDFs com texto (não são imagens), então o app consegue ler no próprio computador, sem internet. Ele reconhece o tipo pelo título do documento e sempre mostra o que encontrou para o médico conferir antes de levar para o round. CPF, CNS, nome da mãe e assinaturas são ignorados, e o PDF é apagado da pasta de entrada depois da importação. Telas de exemplo, com dados fictícios: "Importar evolução anterior", "Importar relato operatório", "Importar prescrição" e "Laudos e pareceres".

| Documento | O que o app aproveita | Onde entra no round |
| --- | --- | --- |
| Evolução médica de outro setor | Identificação, data de internação e setor de origem; diagnósticos e cirurgias com data; comorbidades; alergias; exames citados com data; ATB atual com início e foco e ATB prévio; dispositivos com sítio e data (PVP e CVC são tratados como o mesmo dispositivo); suporte ventilatório | Identificação, Diagnósticos, Alertas, Infecção, Dispositivos, Respiratório e Exames. Exame físico e conduta ficam no PDF |
| Relato cirúrgico | Procedimento, data e hora, especialidade e cirurgião, caráter, anestesia, contaminação, hemocomponente, profilaxia, histopatológico e diagnóstico (CID); na descrição, drenos e ostomias com local, material colhido para cultura e intercorrências; em cirurgia vascular, reconstrução arterial e fasciotomia | Cirurgia e pós-operatório (PO automático), Dispositivos e perdas do balanço, Culturas, Pendências (histopatológico) e bloco vascular |
| Prescrição | Peso e alergias; antimicrobianos com o dia "D (x / y)" e a justificativa; infusões contínuas com a diluição (conferida com o padrão da unidade); corticoide; dieta e NPT; profilaxias de TEV e LAMG; esquema de HGT e insulina | Alertas, Infecção (sem posologia), Hemodinâmica (a vazão continua digitada no leito), Nutrição e Profilaxias. Sintomáticos e cuidados gerais ficam no PDF |
| Laudo de imagem e ecocardiograma | Exame, data e resumo: a "Impressão diagnóstica" quando houver; no eco, FE e achados principais | Imagens e outros exames |
| Parecer | Especialidade que pediu e que respondeu, datas do pedido e da resposta, conclusão e pedidos feitos no texto | Cuidados paliativos (comissão de CP), campo Neurocirurgia (parecer da neurocirurgia) e Pendências |
| Protocolo de antibioticoterapia da CCIH | Lista de antimicrobianos, focos, antibióticos de uso restrito (liberação pela SCIH) e regra de saída do isolamento por TB | Infecção e Isolamento |

Contagem dos antimicrobianos: na prescrição, o antimicrobiano aparece como "D (1 / 7) de 8", com o dia atual e o total previsto. Essa contagem pode começar um dia depois quando a 1ª dose é feita na véspera, como dose imediata ou de ataque (por exemplo, a vancomicina), e a rotina só a prescreve no dia seguinte como D1. Por isso o app usa o D da prescrição apenas como sugestão na primeira importação: o médico confere o D0 (dia da 1ª dose) e o round mantém esse D0 nos dias seguintes; se uma prescrição depois contar diferente, o app só avisa, sem mudar. O "de 8" fica de fora até a TI ou a farmácia explicarem o que significa. As diluições das infusões na prescrição (noradrenalina 20 ml + SG5% 80 ml, fentanil sem diluição, dexmedetomidina 4 ml + SF 96 ml, vasopressina 1 ml + SF 99 ml) batem com as concentrações padrão do protótipo.

## 7. Próximos passos: piloto e indicadores

Começar pequeno: um piloto de 4 semanas, medindo antes e depois, para a decisão final se apoiar em dados das próprias unidades. A fase de testes fica restrita a dois CTIs: CTI 1 (neurológico, 20 leitos, postos 1 e 2) e CTI 2 (pós-operatório, 10 leitos).

Para não assustar quem resiste ao round, o piloto começa pela visualização resumida, e o que cada médico precisa preencher é pouco: identificação, dispositivos, antibióticos, plano e pendências. O resto é opcional. O ganho aparece já no primeiro plantão: dias contados sozinhos, passagem de plantão e evolução padrão com um clique. A divisão de tarefas também ajuda: o ADM lança exames, sinais e dados da enfermagem, e o médico fica com o que exige julgamento clínico. Tudo na base da conversa: a meta é o paciente bem cuidado, não cobrar ninguém.

1. **Reunião com a chefia** — decisões das seções 3 a 6.
2. **Consulta à TI e ao encarregado de dados** — respostas às perguntas da seção 3.
3. **Linha de base** — auditoria simples de um dia, antes de qualquer mudança (indicadores abaixo).
4. **Protótipo** — app com os campos aprovados, testado por 2 ou 3 colegas durante 1 semana.
5. **Piloto** — 4 semanas no CTI 1 (os dois postos) e no CTI 2.
6. **Revisão com a chefia** — manter, ajustar ou encerrar.

| Indicador | Como medir |
| --- | --- |
| Dispositivos com data de inserção registrada (%) | Contagem no round, 1 vez por semana |
| Pendências abertas há mais de 48 h sem atualização | Contagem no round, 1 vez por semana |
| Plantões com round atualizado (%) | Registro de última edição por leito |
| Tempo do round da manhã (min) | Cronometrado 2 vezes por semana |
| Satisfação da equipe (0 a 10) | Uma pergunta ao fim do piloto |
| Infecção associada a dispositivo | Dados da CCIH, acompanhamento de longo prazo |

### Material para o protótipo

- [ ] Soluções padrão da casa (diluições das infusões): recebidas (são as do app Ronda CTI, padrão da unidade) e já no protótipo
- [x] PDF da CCIH com os antimicrobianos recomendados: recebido em 30/10 (protocolo de antibioticoterapia). Lista de antimicrobianos, focos e antibióticos de uso restrito já no protótipo
- [ ] Lista da CCIH com o tipo de precaução por germe ou doença e os critérios de liberação do isolamento: o protocolo de antibioticoterapia só traz a regra da tuberculose (já no protótipo); falta a dos outros germes e dos vírus respiratórios
- [ ] Um exemplo anonimizado de cada PDF do sistema do hospital: laudo de imagem, resultado de laboratório, prescrição e evolução médica de outro setor, evoluções da comissão de CP, da psicologia e do serviço social, e relato operatório (um da neurocirurgia e um de outra especialidade cirúrgica, como a cirurgia geral ou a vascular). Recebidos em 30/10: evolução de outro setor, prescrição, laudos de TC e de ecocardiograma, relatos cirúrgicos (cirurgia geral e vascular) e parecer da comissão de CP (ver 6.19). Faltam: resultado de laboratório (e gasometria, se sair separada), relato da neurocirurgia e evoluções da psicologia e do serviço social
- [x] Número de leitos do CTI neurológico: 20, em dois postos
- [ ] Folha de controles da enfermagem (Balanço Hídrico, ENF-FOR-001): recebida em 30/10. Período de 07:00 a 07:00, com parciais de 6 h e totais de 12 h (SD e SN) e de 24 h. Sinais: T, FC, FR, PA, PAM, SatO₂, dor; HGT e insulina (SC, EV); administrados (HV, dieta VO e enteral); eliminados: HD, diurese, SNG, dreno 1, dreno 2 e evacuações. O app usa o total de 24 h de cada linha; PAM, número de evacuações e HD já entraram nas telas
- [ ] Como a comissão de cuidados paliativos do hospital é acionada
- [ ] CTI 2: validar com a chefia e a cirurgia geral os campos de pós-operatório (seção 6.17)
- [ ] Protocolo do idoso com fratura de fêmur usado no hospital (metas e etapas), para o app seguir o mesmo

## Fontes

- [Lei nº 13.709/2018 (LGPD), texto compilado — Planalto](https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm)
- [Parecer CRM-MG nº 80/2023, com a definição de prontuário da Res. CFM 1.638/2002 e a Res. CFM 1.821/2007](https://sistemas.cfm.org.br/normas/arquivos/pareceres/MG/2023/80_2023.pdf)
- [O POVO, 29/01/2026: dados de pacientes cearenses expostos em site público](https://mais.opovo.com.br/jornal/reportagem/2026/01/29/dados-de-pacientes-cearenses-sao-expostos-em-site-publico.html)
- [Ministério da Saúde institui a Política Nacional de Cuidados Paliativos no SUS (Portaria GM/MS nº 3.681/2024) — Estratégia MED](https://med.estrategia.com/portal/noticias/ministerio-da-saude-institui-politica-nacional-de-cuidados-paliativos-no-sus/)
- [CFM: diretivas antecipadas de vontade no prontuário (Res. CFM 1.995/2012) e ortotanásia (Res. CFM 1.805/2006)](https://portal.cfm.org.br/noticias/pacientes-poderao-registrar-em-prontuario-a-quais-procedimentos-querem-ser-submetidos-no-fim-da-vida/)
- [Resolução CFM nº 2.173/2017: critérios do diagnóstico de morte encefálica](https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2017/2173_2017.pdf)
- [Diretrizes Brasileiras para o Tratamento de Fratura do Colo do Fêmur em Idosos — Ministério da Saúde (Portaria Conjunta nº 21/2018)](https://www.gov.br/saude/pt-br/assuntos/pcdt/arquivos/2018/fratura-do-colo-do-femur-em-idosos-tratamento-diretrizes-brasileiras.pdf)
- 18 rounds do CTI II (jul–out/2026), analisados para a seção 2; nenhum dado de paciente reproduzido.
