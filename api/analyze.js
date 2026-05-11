// api/analyze.js — Vercel Serverless Function
// Recebe imagem base64, envia ao Claude, retorna figurinhas identificadas

const PLAYERS = {
  FWC1:"Emblema Oficial",FWC2:"Emblema Oficial",FWC3:"Mascotes Oficiais",FWC4:"Slogan Oficial",FWC5:"Bola Oficial",FWC6:"Canadá - Sede",FWC7:"México - Sede",FWC8:"EUA - Sede",FWC9:"Itália 1934",FWC10:"Uruguai 1950",FWC11:"Alemanha 1954",FWC12:"Brasil 1962",FWC13:"Alemanha 1974",FWC14:"Argentina 1986",FWC15:"Brasil 1994",FWC16:"Brasil 2002",FWC17:"Itália 2006",FWC18:"Alemanha 2014",FWC19:"Argentina 2022",
  MEX1:"Escudo",MEX2:"Luis Malagón",MEX3:"Johan Vasquez",MEX4:"Jorge Sánchez",MEX5:"Cesar Montes",MEX6:"Jesus Gallardo",MEX7:"Israel Reyes",MEX8:"Diego Lainez",MEX9:"Carlos Rodriguez",MEX10:"Edson Alvarez",MEX11:"Orbelin Pineda",MEX12:"Marcel Ruiz",MEX13:"Foto do Time",MEX14:"Érick Sánchez",MEX15:"Hirving Lozano",MEX16:"Santiago Giménez",MEX17:"Raúl Jiménez",MEX18:"Alexis Vega",MEX19:"Roberto Alvarado",MEX20:"Cesar Huerta",
  RSA1:"Escudo",RSA2:"Ronwen Williams",RSA3:"Sipho Chaine",RSA4:"Aubrey Modiba",RSA5:"Samukele Kabini",RSA6:"Mbekezeli Mbokazi",RSA7:"Khulumani Ndamane",RSA8:"Siyabonga Ngezana",RSA9:"Khuliso Mudau",RSA10:"Nkosinathi Sibisi",RSA11:"Teboho Mokoena",RSA12:"Thalente Mbatha",RSA13:"Foto do Time",RSA14:"Bathasi Aubaas",RSA15:"Yaya Sithole",RSA16:"Sipho Mbule",RSA17:"Lyle Foster",RSA18:"Iqraam Rayners",RSA19:"Mohau Nkota",RSA20:"Oswin Appollis",
  KOR1:"Escudo",KOR2:"Hyeon-woo Jo",KOR3:"Seung-Gyu Kim",KOR4:"Min-jae Kim",KOR5:"Yu-min Cho",KOR6:"Young-woo Seol",KOR7:"Han-beom Lee",KOR8:"Tae-seok Lee",KOR9:"Myung-jae Lee",KOR10:"Jae-sung Lee",KOR11:"In-beom Hwang",KOR12:"Kang-in Lee",KOR13:"Foto do Time",KOR14:"Seung-ho Paik",KOR15:"Jens Castrop",KOR16:"Dong-gyeong Lee",KOR17:"Gue-sung Cho",KOR18:"Heung-min Son",KOR19:"Hee-chan Hwang",KOR20:"Hyeon-Gyu Oh",
  CZE1:"Escudo",CZE2:"Matej Kovar",CZE3:"Jindrich Stanek",CZE4:"Ladislav Krejci",CZE5:"Vladimir Coufal",CZE6:"Jaroslav Zeleny",CZE7:"Tomas Holes",CZE8:"David Zima",CZE9:"Michal Sadilek",CZE10:"Lukas Provod",CZE11:"Lukas Cerv",CZE12:"Tomas Soucek",CZE13:"Foto do Time",CZE14:"Pavel Sulc",CZE15:"Matej Vydra",CZE16:"Vasil Kusej",CZE17:"Tomas Chory",CZE18:"Vaclav Cerny",CZE19:"Adam Hlozek",CZE20:"Patrik Schick",
  CAN1:"Escudo",CAN2:"Dayne St.Clair",CAN3:"Alphonso Davies",CAN4:"Alistair Johnston",CAN5:"Samuel Adekugbe",CAN6:"Riche Larvea",CAN7:"Derek Cornelius",CAN8:"Moïse Bombito",CAN9:"Kamal Miller",CAN10:"Stephen Eustáquio",CAN11:"Ismaël Koné",CAN12:"Jonathan Osorio",CAN13:"Foto do Time",CAN14:"Jacob Shaffelburg",CAN15:"Mathieu Choinière",CAN16:"Niko Sigur",CAN17:"Tajon Buchanan",CAN18:"Liam Millar",CAN19:"Cyle Larin",CAN20:"Jonathan David",
  BIH1:"Escudo",BIH2:"Nikola Vasilj",BIH3:"Amer Dedic",BIH4:"Sead Kolasinac",BIH5:"Tarik Muharemovic",BIH6:"Nihad Mujakic",BIH7:"Nikola Katic",BIH8:"Amir Hadziahmetovic",BIH9:"Benjamin Tahirovic",BIH10:"Armin Gigovic",BIH11:"Ivan Sunjic",BIH12:"Ivan Basic",BIH13:"Foto do Time",BIH14:"Dzenis Burnic",BIH15:"Esmir Bajraktarevic",BIH16:"Amar Memic",BIH17:"Ermedin Demirovic",BIH18:"Edin Dzeko",BIH19:"Samed Bazdar",BIH20:"Haris Tabakovic",
  QAT1:"Escudo",QAT2:"Meshaal Barsham",QAT3:"Sultan Albrake",QAT4:"Lucas Mendes",QAT5:"Homam Ahmed",QAT6:"Boualem Khoukhi",QAT7:"Pedro Miguel",QAT8:"Tarek Salman",QAT9:"Mohamed Al-Mannai",QAT10:"Karim Boudiaf",QAT11:"Assim Madibo",QAT12:"Ahmed Fatehi",QAT13:"Foto do Time",QAT14:"Mohammed Waad",QAT15:"Abdulaziz Hatem",QAT16:"Hassan Al-Haydos",QAT17:"Edmilson Junior",QAT18:"Akram Hassan Afif",QAT19:"Ahmed Al Ganehi",QAT20:"Almoez Ali",
  SUI1:"Escudo",SUI2:"Gregor Kobel",SUI3:"Yvon Mvogo",SUI4:"Manuel Akanji",SUI5:"Ricardo Rodriguez",SUI6:"Nico Elvedi",SUI7:"Aurèle Amenda",SUI8:"Silvan Widmer",SUI9:"Granit Xhaka",SUI10:"Denis Zakaria",SUI11:"Remo Freuler",SUI12:"Fabian Rieder",SUI13:"Foto do Time",SUI14:"Ardon Jashari",SUI15:"Johan Manzambi",SUI16:"Michel Aebischer",SUI17:"Breel Embolo",SUI18:"Ruben Vargas",SUI19:"Dan Ndoye",SUI20:"Zeki Amdouni",
  BRA1:"Escudo",BRA2:"Alisson",BRA3:"Bento",BRA4:"Marquinhos",BRA5:"Éder Militão",BRA6:"Gabriel Magalhães",BRA7:"Danilo",BRA8:"Wesley",BRA9:"Lucas Paquetá",BRA10:"Casemiro",BRA11:"Bruno Guimarães",BRA12:"Luiz Henrique",BRA13:"Foto do Time",BRA14:"Vinicius Júnior",BRA15:"Rodrygo",BRA16:"João Pedro",BRA17:"Matheus Cunha",BRA18:"Gabriel Martinelli",BRA19:"Raphinha",BRA20:"Estévão",
  MAR1:"Escudo",MAR2:"Yassine Bounou",MAR3:"Munir El Kajoui",MAR4:"Achraf Hakimi",MAR5:"Noussair Mazraoui",MAR6:"Nayef Aguerd",MAR7:"Roman Saiss",MAR8:"Jawad El Yamio",MAR9:"Adam Masina",MAR10:"Sofyan Amrabat",MAR11:"Azzedine Ounahi",MAR12:"Eliesse Ben Seghir",MAR13:"Foto do Time",MAR14:"Bilal El Khannouss",MAR15:"Ismael Saibari",MAR16:"Youssef En-Nesyri",MAR17:"Abde Ezzalzouli",MAR18:"Soufiane Rahimi",MAR19:"Brahim Diaz",MAR20:"Ayoub El Kaabi",
  HAI1:"Escudo",HAI2:"Johny Placide",HAI3:"Carlens Arcus",HAI4:"Martin Expérience",HAI5:"Jean-Kevin Duverne",HAI6:"Ricardo Adé",HAI7:"Duke Lacroix",HAI8:"Garven Metusala",HAI9:"Hannes Delcroix",HAI10:"Leverton Pierre",HAI11:"Danley Jean Jacques",HAI12:"Jean-Ricner Bellegarde",HAI13:"Foto do Time",HAI14:"Christopher Attys",HAI15:"Derrick Etienne Jr",HAI16:"Josue Casimir",HAI17:"Ruben Providence",HAI18:"Duckens Nazon",HAI19:"Louicius Deedson",HAI20:"Frantzdy Pierrot",
  SCO1:"Escudo",SCO2:"Angus Gunn",SCO3:"Jack Hendry",SCO4:"Kieran Tierney",SCO5:"Aaron Hickey",SCO6:"Andrew Robertson",SCO7:"Scott McKenna",SCO8:"John Souttar",SCO9:"Anthony Ralston",SCO10:"Grant Hanley",SCO11:"Scott McTominay",SCO12:"Billy Gilmour",SCO13:"Foto do Time",SCO14:"Lewis Ferguson",SCO15:"Ryan Christie",SCO16:"Kenny McLean",SCO17:"John McGinn",SCO18:"Lyndon Dykes",SCO19:"Che Adams",SCO20:"Ben Gannon-Doak",
  USA1:"Escudo",USA2:"Matt Freese",USA3:"Chris Richards",USA4:"Tim Ream",USA5:"Mark McKenzie",USA6:"Alex Freeman",USA7:"Antonee Robinson",USA8:"Tyler Adams",USA9:"Tanner Tessmann",USA10:"Weston McKennie",USA11:"Christian Roldan",USA12:"Timothy Weah",USA13:"Foto do Time",USA14:"Diego Luna",USA15:"Malik Tillman",USA16:"Christian Pulisic",USA17:"Brenden Aaronson",USA18:"Ricardo Pepi",USA19:"Haji Wright",USA20:"Folarin Balogun",
  PAR1:"Escudo",PAR2:"Roberto Fernandez",PAR3:"Orlando Gill",PAR4:"Gustavo Gomez",PAR5:"Fabián Balbuena",PAR6:"Juan José Cáceres",PAR7:"Omar Alderete",PAR8:"Junior Alonso",PAR9:"Mathías Villasanti",PAR10:"Diego Gomez",PAR11:"Damián Bobadilla",PAR12:"Andres Cubas",PAR13:"Foto do Time",PAR14:"Matias Galarza",PAR15:"Julio Enciso",PAR16:"Alejandro Romero Gamarra",PAR17:"Miguel Almirón",PAR18:"Ramon Sosa",PAR19:"Angel Romero",PAR20:"Antonio Sanabria",
  AUS1:"Escudo",AUS2:"Mathew Ryan",AUS3:"Joe Gauci",AUS4:"Harry Souttar",AUS5:"Alessandro Circati",AUS6:"Jordan Bos",AUS7:"Aziz Behich",AUS8:"Cameron Burgess",AUS9:"Lewis Miller",AUS10:"Milos Degenek",AUS11:"Jackson Irvine",AUS12:"Riley McGree",AUS13:"Foto do Time",AUS14:"Aiden O'Neill",AUS15:"Connor Metcalfe",AUS16:"Patrick Yazbek",AUS17:"Craig Goodwin",AUS18:"Kusini Vengi",AUS19:"Nestory Irankunda",AUS20:"Mohamed Touré",
  TUR1:"Escudo",TUR2:"Ugurcan Cakir",TUR3:"Mert Muldur",TUR4:"Zeki Celik",TUR5:"Abdulkerim Bardakci",TUR6:"Caglar Soyuncu",TUR7:"Merih Demiral",TUR8:"Ferdi Kadioglu",TUR9:"Kaan Ayhan",TUR10:"Ismail Yuksek",TUR11:"Hakan Calhanoglu",TUR12:"Orkun Kokcu",TUR13:"Foto do Time",TUR14:"Arda Guler",TUR15:"Irfan Can Kahveci",TUR16:"Yunus Akgun",TUR17:"Can Uzun",TUR18:"Baris Alper Yilmaz",TUR19:"Kerem Akturkoglu",TUR20:"Kenan Yildiz",
  GER1:"Escudo",GER2:"Marc-André ter Stegen",GER3:"Jonathan Tah",GER4:"David Raum",GER5:"Nico Schlotterbeck",GER6:"Antonio Rüdiger",GER7:"Waldemar Anton",GER8:"Ridle Baku",GER9:"Maximilian Mittelstadt",GER10:"Joshua Kimmich",GER11:"Florian Wirtz",GER12:"Felix Nmecha",GER13:"Foto do Time",GER14:"Leon Goretzka",GER15:"Jamal Musiala",GER16:"Serge Gnabry",GER17:"Kai Havertz",GER18:"Leroy Sane",GER19:"Karim Adeyemi",GER20:"Nick Woltemade",
  CUW1:"Escudo",CUW2:"Eloy Room",CUW3:"Armando Obispo",CUW4:"Sherel Floranus",CUW5:"Jurien Gaari",CUW6:"Joshua Brenet",CUW7:"Roshon Van Eijma",CUW8:"Shurandy Sambo",CUW9:"Livano Comenencia",CUW10:"Godfried Roemeratoe",CUW11:"Juninho Bacuna",CUW12:"Leandro Bacuna",CUW13:"Foto do Time",CUW14:"Tahith Chong",CUW15:"Kenji Gorre",CUW16:"Jearl Margaritha",CUW17:"Jurgen Locadia",CUW18:"Jeremy Antonisse",CUW19:"Gervane Kastaneer",CUW20:"Sontje Hansen",
  CIV1:"Escudo",CIV2:"Yahia Fofana",CIV3:"Ghislain Konan",CIV4:"Wilfried Singo",CIV5:"Odilon Kossounou",CIV6:"Evan Ndicka",CIV7:"Willy Boly",CIV8:"Emmanuel Agbadou",CIV9:"Ousmane Diomande",CIV10:"Franck Kessie",CIV11:"Seko Fofana",CIV12:"Ibrahim Sangare",CIV13:"Foto do Time",CIV14:"Jean-Philippe Gbamin",CIV15:"Amad Diallo",CIV16:"Sébastien Haller",CIV17:"Simon Adingra",CIV18:"Yan Diomande",CIV19:"Evann Guessand",CIV20:"Oumar Diakite",
  ECU1:"Escudo",ECU2:"Hernán Galíndez",ECU3:"Gonzalo Valle",ECU4:"Piero Hincapié",ECU5:"Pervis Estupiñán",ECU6:"Willian Pacho",ECU7:"Ángelo Preciado",ECU8:"Joel Ordóñez",ECU9:"Moises Caicedo",ECU10:"Alan Franco",ECU11:"Kendry Paez",ECU12:"Pedro Vite",ECU13:"Foto do Time",ECU14:"John Veboah",ECU15:"Leonardo Campana",ECU16:"Gonzalo Plata",ECU17:"Nilson Angulo",ECU18:"Alan Minda",ECU19:"Kevin Rodriguez",ECU20:"Enner Valencia",
  NED1:"Escudo",NED2:"Bart Verbruggen",NED3:"Virgil van Dijk",NED4:"Micky van de Ven",NED5:"Jurrien Timber",NED6:"Denzel Dumfries",NED7:"Nathan Aké",NED8:"Jeremie Frimpong",NED9:"Jan Paul van Hecke",NED10:"Tijjani Reijnders",NED11:"Ryan Gravenberch",NED12:"Teun Koopmeiners",NED13:"Foto do Time",NED14:"Frenkie de Jong",NED15:"Xavi Simons",NED16:"Justin Kluivert",NED17:"Memphis Depay",NED18:"Donyell Malen",NED19:"Wout Weghorst",NED20:"Cody Gakpo",
  JPN1:"Escudo",JPN2:"Zion Suzuki",JPN3:"Henry Heroki Mochizuki",JPN4:"Ayumu Seko",JPN5:"Junnosuke Suzuki",JPN6:"Shogo Taniguchi",JPN7:"Tsuyoshi Watanabe",JPN8:"Kaishu Sano",JPN9:"Yuki Soma",JPN10:"Ao Tanaka",JPN11:"Daichi Kamada",JPN12:"Takefusa Kubo",JPN13:"Foto do Time",JPN14:"Ritsu Doan",JPN15:"Keito Nakamura",JPN16:"Takumi Minamino",JPN17:"Shuto Machino",JPN18:"Junya Ito",JPN19:"Koki Ogawa",JPN20:"Ayase Ueda",
  SWE1:"Escudo",SWE2:"Victor Johansson",SWE3:"Isak Hien",SWE4:"Gabriel Gudmundsson",SWE5:"Emil Holm",SWE6:"Victor Nilsson Lindelöf",SWE7:"Gustaf Lagerbielke",SWE8:"Lucas Bergvall",SWE9:"Hugo Larsson",SWE10:"Jesper Karlström",SWE11:"Yasin Ayari",SWE12:"Mattias Svanberg",SWE13:"Foto do Time",SWE14:"Daniel Svensson",SWE15:"Ken Sema",SWE16:"Roony Bardghji",SWE17:"Dejan Kulusevski",SWE18:"Anthony Elanga",SWE19:"Alexander Isak",SWE20:"Viktor Gyökeres",
  TUN1:"Escudo",TUN2:"Bechir Ben Said",TUN3:"Aymen Dahmen",TUN4:"Yan Valery",TUN5:"Montassar Talbi",TUN6:"Yassine Meriah",TUN7:"Ali Abdi",TUN8:"Dylan Bronn",TUN9:"Ellyes Skhiri",TUN10:"Aissa Laidouni",TUN11:"Ferjani Sassi",TUN12:"Mohamed Ali Ben Romdhane",TUN13:"Foto do Time",TUN14:"Hannibal Mejbri",TUN15:"Elias Achouri",TUN16:"Elias Saad",TUN17:"Hazem Mastouri",TUN18:"Ismael Gharbi",TUN19:"Sayfallah Ltaief",TUN20:"Naim Sliti",
  BEL1:"Escudo",BEL2:"Thibaut Courtois",BEL3:"Arthur Theate",BEL4:"Timothy Castagne",BEL5:"Zeno Debast",BEL6:"Brandon Mechele",BEL7:"Maxim De Cuyper",BEL8:"Thomas Meunier",BEL9:"Youri Tielemans",BEL10:"Amadou Onana",BEL11:"Nicolas Raskin",BEL12:"Alexis Saelemaekers",BEL13:"Foto do Time",BEL14:"Hans Vanaken",BEL15:"Kevin De Bruyne",BEL16:"Jérémy Doku",BEL17:"Charles De Ketelaere",BEL18:"Leandro Trossard",BEL19:"Loïs Openda",BEL20:"Romelu Lukaku",
  EGY1:"Escudo",EGY2:"Mohamed El Shenawy",EGY3:"Mohamed Hany",EGY4:"Mohamed Hamdy",EGY5:"Yasser Ibrahim",EGY6:"Khaled Sobhi",EGY7:"Ramy Rabia",EGY8:"Hossam Abdelmaguid",EGY9:"Ahmed Fatouh",EGY10:"Marwan Attia",EGY11:"Zizo",EGY12:"Hamdy Fathy",EGY13:"Foto do Time",EGY14:"Mohamed Lasheen",EGY15:"Emam Ashour",EGY16:"Osama Faisal",EGY17:"Mohamed Salah",EGY18:"Mostafa Mohamed",EGY19:"Trezeguet",EGY20:"Omar Marmoush",
  IRN1:"Escudo",IRN2:"Alireza Beiranvand",IRN3:"Morteza Pouraliganji",IRN4:"Ehsan Hajsafi",IRN5:"Milad Mohammadi",IRN6:"Shojae Khalilzadeh",IRN7:"Ramin Rezaeian",IRN8:"Hossein Kanaani",IRN9:"Sadegh Moharrami",IRN10:"Saleh Hardani",IRN11:"Saeed Ezatolahi",IRN12:"Saman Ghoddos",IRN13:"Foto do Time",IRN14:"Omid Noorafkan",IRN15:"Roozbeh Cheshmi",IRN16:"Mohammad Mohebi",IRN17:"Sardar Azmoun",IRN18:"Mehdi Taremi",IRN19:"Alireza Jahanbakhsh",IRN20:"Ali Gholizadeh",
  NZL1:"Escudo",NZL2:"Max Crocombe",NZL3:"Alex Paulsen",NZL4:"Michael Boxall",NZL5:"Liberato Cacace",NZL6:"Tim Payne",NZL7:"Tyler Bindon",NZL8:"Francis de Vries",NZL9:"Finn Surman",NZL10:"Joe Bell",NZL11:"Sarpreet Singh",NZL12:"Ryan Thomas",NZL13:"Foto do Time",NZL14:"Matthew Garbett",NZL15:"Marko Stamenić",NZL16:"Ben Old",NZL17:"Chris Wood",NZL18:"Elijah Just",NZL19:"Callum McCowatt",NZL20:"Kosta Barbarouses",
  ESP1:"Escudo",ESP2:"Unai Simon",ESP3:"Robin Le Normand",ESP4:"Aymeric Laporte",ESP5:"Dean Huijsen",ESP6:"Pedro Porro",ESP7:"Dani Carvajal",ESP8:"Marc Cucurella",ESP9:"Martín Zubimendi",ESP10:"Rodri",ESP11:"Pedri",ESP12:"Fabian Ruiz",ESP13:"Foto do Time",ESP14:"Mikel Merino",ESP15:"Lamine Yamal",ESP16:"Dani Olmo",ESP17:"Nico Williams",ESP18:"Ferran Torres",ESP19:"Álvaro Morata",ESP20:"Mikel Oyarzabal",
  CPV1:"Escudo",CPV2:"Vozinha",CPV3:"Logan Costa",CPV4:"Pico",CPV5:"Diney",CPV6:"Steven Moreira",CPV7:"Wagner Pina",CPV8:"Joao Paulo",CPV9:"Yannick Semedo",CPV10:"Kevin Pina",CPV11:"Patrick Andrade",CPV12:"Jamiro Monteiro",CPV13:"Foto do Time",CPV14:"Deroy Duarte",CPV15:"Willy Semedo",CPV16:"Jovane Cabral",CPV17:"Ryan Mendes",CPV18:"Dailon Livramento",CPV19:"Garry Rodrigues",CPV20:"Bebé",
  KSA1:"Escudo",KSA2:"Nawaf Al-Aqidi",KSA3:"Abdulrahman Alsanbi",KSA4:"Saud Abdulhamid",KSA5:"Nawaf Al-Bumashl",KSA6:"Jehad Thikri",KSA7:"Moteb Alharbi",KSA8:"Hassan Altambakti",KSA9:"Musab Aljuwayr",KSA10:"Ziyad Aljohani",KSA11:"Abdullah Al-Khaibari",KSA12:"Nasser Aldawsari",KSA13:"Foto do Time",KSA14:"Saleh Abu Alshamat",KSA15:"Marwan Alsahafi",KSA16:"Salem Al-Dawsari",KSA17:"Abdulrahman Alobud",KSA18:"Feras Al-Buraikan",KSA19:"Saleh Al-Shehri",KSA20:"Abdullah Al-Hamdan",
  URU1:"Escudo",URU2:"Sergio Rochet",URU3:"Santiago Mele",URU4:"Ronald Araujo",URU5:"Jose Maria Gimenez",URU6:"Sebastian Cáceres",URU7:"Mathias Olivera",URU8:"Guillermo Varela",URU9:"Nahitan Nandez",URU10:"Federico Valverde",URU11:"Giorgian De Arrascaeta",URU12:"Rodrigo Bentancur",URU13:"Foto do Time",URU14:"Manuel Ugarte",URU15:"Nicolas De La Cruz",URU16:"Maxi Araujo",URU17:"Darwin Núñez",URU18:"Federico Viñas",URU19:"Rodrigo Aguirre",URU20:"Facundo Pellistri",
  FRA1:"Escudo",FRA2:"Mike Maignan",FRA3:"Theo Hernandez",FRA4:"William Saliba",FRA5:"Jules Kounde",FRA6:"Ibrahima Konaté",FRA7:"Dinot Upamecano",FRA8:"Lucas Digne",FRA9:"Aurélien Tchouaméni",FRA10:"Eduardo Camavinga",FRA11:"Manu Koné",FRA12:"Adrien Rabiot",FRA13:"Foto do Time",FRA14:"Antoine Griezmann",FRA15:"Michael Olise",FRA16:"Ousmane Dembélé",FRA17:"Bradley Barcola",FRA18:"Desire Doue",FRA19:"Kingsley Coman",FRA20:"Hugo Ekitike",
  SEN1:"Escudo",SEN2:"Édouard Mendy",SEN3:"Saliou Ciss",SEN4:"Kalidou Koulibaly",SEN5:"Moussa Niakhate",SEN6:"Abdoulaye Seck",SEN7:"Ismail Jakobs",SEN8:"El Hadj Malick Diouf",SEN9:"Pissa Cama Gueye",SEN10:"Pape Matar Sarr",SEN11:"Pape Gueye",SEN12:"Habib Diarra",SEN13:"Foto do Time",SEN14:"Lamine Camara",SEN15:"Sadio Mané",SEN16:"Ismaila Sarr",SEN17:"Boulaye Dia",SEN18:"Iliman Ndiaye",SEN19:"Nicolas Jackson",SEN20:"Krepin Diatta",
  IRQ1:"Escudo",IRQ2:"Jalal Hassan",IRQ3:"Dhurgham Ismail",IRQ4:"Rebin Sulaka",IRQ5:"Hussein Ali",IRQ6:"Akam Hashem",IRQ7:"Nrougas Doski",IRQ8:"Ziad Tahseen",IRQ9:"Manaf Younis",IRQ10:"Zeiane Iqbal",IRQ11:"Amir Al-Ammari",IRQ12:"Ibrahim Bayesh",IRQ13:"Foto do Time",IRQ14:"Ali Jasim",IRQ15:"Yousse Amyn",IRQ16:"Amani Smer",IRQ17:"Marco Farija",IRQ18:"Osama Rashid",IRQ19:"Ali Al-Hamadi",IRQ20:"Janen Hussein",
  NOR1:"Escudo",NOR2:"Orjan Nyland",NOR3:"Julian Ryerson",NOR4:"Leo Ostigard",NOR5:"Kristoffer Vassbakk Ajer",NOR6:"Marcus Holmgren Pedersen",NOR7:"David Møller Wolfe",NOR8:"Torbjørn Heggem",NOR9:"Morten Thorsby",NOR10:"Martin Ødegaard",NOR11:"Sander Berge",NOR12:"Andreas Schjelderup",NOR13:"Foto do Time",NOR14:"Patrick Berg",NOR15:"Erling Haaland",NOR16:"Alexander Sørloth",NOR17:"Aron Dønnum",NOR18:"Jørgen Strand Larsen",NOR19:"Antonio Nusa",NOR20:"Oscar Bobb",
  ARG1:"Escudo",ARG2:"Emiliano Martínez",ARG3:"Nahuel Molina",ARG4:"Cristian Romero",ARG5:"Nicolás Otamendi",ARG6:"Nicolás Tagliafico",ARG7:"Leonardo Balerdi",ARG8:"Enzo Fernández",ARG9:"Alexis Mac Allister",ARG10:"Rodrigo De Paul",ARG11:"Exequiel Palacios",ARG12:"Leandro Paredes",ARG13:"Foto do Time",ARG14:"Nico Paz",ARG15:"Franco Mastantuono",ARG16:"Nico González",ARG17:"Lionel Messi",ARG18:"Lautaro Martínez",ARG19:"Julián Álvarez",ARG20:"Giuliano Simeone",
  ALG1:"Escudo",ALG2:"Alexis Guendouz",ALG3:"Ramy Bensebaini",ALG4:"Youcef Atal",ALG5:"Rayan Aït-Nouri",ALG6:"Mohamed Amine Tougai",ALG7:"Aïssa Mandi",ALG8:"Ismael Bennacer",ALG9:"Houssem Aouar",ALG10:"Hicham Boudaoui",ALG11:"Ramiz Zerrouki",ALG12:"Nabil Bentaleb",ALG13:"Foto do Time",ALG14:"Farés Chaibi",ALG15:"Riyad Mahrez",ALG16:"Said Benrahma",ALG17:"Anis Hadj Moussa",ALG18:"Amir Gouiri",ALG19:"Djaouad Bounedjar",ALG20:"Mohamed Amoura",
  AUT1:"Escudo",AUT2:"Alexander Schlager",AUT3:"Patrick Pentz",AUT4:"Stefan Posch",AUT5:"David Alaba",AUT6:"Kevin Danso",AUT7:"Philipp Lienhart",AUT8:"Philipp Mwene",AUT9:"Alexander Prass",AUT10:"Xaver Schlager",AUT11:"Marcel Sabitzer",AUT12:"Konrad Laimer",AUT13:"Foto do Time",AUT14:"Florian Grillitsch",AUT15:"Nicolas Seiwald",AUT16:"Romano Schmid",AUT17:"Patrick Wimmer",AUT18:"Christoph Baumgartner",AUT19:"Michael Gregoritsch",AUT20:"Marko Arnautovic",
  JOR1:"Escudo",JOR2:"Yazeed Abo Laila",JOR3:"Mahmoud Suleiman",JOR4:"Ihsan Haddad",JOR5:"Mohammad Abu Hashish",JOR6:"Yazan Al-Arab",JOR7:"Abdallah Nasib",JOR8:"Saleem Obaid",JOR9:"Mohammad Abunaloh",JOR10:"Ibrahim Saadeh",JOR11:"Nizar Al-Rashdan",JOR12:"Noor Al-Rawabdeh",JOR13:"Foto do Time",JOR14:"Mohammad Abu Taha",JOR15:"Amer Jamous",JOR16:"Mousa Al-Taamari",JOR17:"Yazan Al-Naimat",JOR18:"Mahmoud Al-Mardi",JOR19:"Ali Olwan",JOR20:"Mohammad Abu Zrayo",
  POR1:"Escudo",POR2:"Diogo Costa",POR3:"José Sá",POR4:"Rúben Dias",POR5:"João Cancelo",POR6:"Diogo Dalot",POR7:"Nuno Mendes",POR8:"Gonçalo Loronha",POR9:"Bernardo Silva",POR10:"Bruno Fernandes",POR11:"Rúben Neves",POR12:"Vitinha",POR13:"Foto do Time",POR14:"João Neves",POR15:"Cristiano Ronaldo",POR16:"Francisco Trincão",POR17:"João Félix",POR18:"Gonçalo Ramos",POR19:"Pedro Neto",POR20:"Rafael Leão",
  COD1:"Escudo",COD2:"Lionel Mpasi",COD3:"Aaron Wan-Bissaka",COD4:"Axel Tuanzebe",COD5:"Arthur Masuaku",COD6:"Chancel Mbemba",COD7:"Joris Kayembe",COD8:"Charles Pickel",COD9:"Nkajuel Mukau",COD10:"Edo Kayembe",COD11:"Samuel Moutoussamv",COD12:"Theo Bongonda",COD13:"Foto do Time",COD14:"Meschack Elia",COD15:"Yoane Wissa",COD16:"Cedric Bakambu",COD17:"Fiston Mavele",COD18:"Fiston Mavele",COD19:"Cedric Bakambu",COD20:"Nathanael Mbuku",
  UZB1:"Escudo",UZB2:"Utkir Yusupov",UZB3:"Farrukh Sayfiev",UZB4:"Sherzod Nasrullayev",UZB5:"Umar Eshmurodov",UZB6:"Husnodin Aliqulov",UZB7:"Rustam Ashurmatov",UZB8:"Khojuakbar Alijonov",UZB9:"Abdoudor Khusanov",UZB10:"Odiljon Hamrobekov",UZB11:"Otabek Shukurov",UZB12:"Jamshid Iskanderov",UZB13:"Foto do Time",UZB14:"Azizbek Turgunbekov",UZB15:"Khojimat Erkinov",UZB16:"Eldor Shomurodov",UZB17:"Oston Urunov",UZB18:"Jaloliddin Masharipov",UZB19:"Igor Sergeev",UZB20:"Abbosbek Fayzullayev",
  COL1:"Escudo",COL2:"Camilo Vargas",COL3:"David Ospina",COL4:"Davinson Sánchez",COL5:"Yerry Mina",COL6:"Daniel Muñoz",COL7:"Johan Mojica",COL8:"Jhon Lucumí",COL9:"Santiago Arias",COL10:"Jefferson Lerma",COL11:"Kevin Castaño",COL12:"Richard Ríos",COL13:"Foto do Time",COL14:"James Rodríguez",COL15:"Juan Fernando Quintero",COL16:"Jorge Carrascal",COL17:"Jhon Arias",COL18:"Jhon Córdoba",COL19:"Luis Suárez",COL20:"Luis Díaz",
  ENG1:"Escudo",ENG2:"Jordan Pickford",ENG3:"John Stones",ENG4:"Marc Guehi",ENG5:"Ezri Konsa",ENG6:"Trent Alexander-Arnold",ENG7:"Reece James",ENG8:"Dan Burn",ENG9:"Jordan Henderson",ENG10:"Declan Rice",ENG11:"Jude Bellingham",ENG12:"Cole Palmer",ENG13:"Foto do Time",ENG14:"Morgan Rogers",ENG15:"Anthony Gordon",ENG16:"Phil Foden",ENG17:"Bukayo Saka",ENG18:"Harry Kane",ENG19:"Marcus Rashford",ENG20:"Ollie Watkins",
  CRO1:"Escudo",CRO2:"Dominik Livaković",CRO3:"Duje Caleta-Car",CRO4:"Joško Gvardiol",CRO5:"Martin Erlić",CRO6:"Josip Stanišić",CRO7:"Luka Vušković",CRO8:"Josip Šutalo",CRO9:"Kristijan Jakić",CRO10:"Luka Modrić",CRO11:"Mateo Kovačić",CRO12:"Martin Baturina",CRO13:"Foto do Time",CRO14:"Lovro Majer",CRO15:"Mario Pašalić",CRO16:"Petar Sučić",CRO17:"Ivan Perišić",CRO18:"Marco Pašalić",CRO19:"Ante Budimir",CRO20:"Andrej Kramarić",
  GHA1:"Escudo",GHA2:"Lawrence Ati-Zigi",GHA3:"Tariq Lamptey",GHA4:"Mohammed Salisu",GHA5:"Alidu Seidu",GHA6:"Alexander Djiku",GHA7:"Gideon Mensah",GHA8:"Caleb Yirenkyi",GHA9:"Abdul Isshaku Fatawu",GHA10:"Thomas Partey",GHA11:"Salis Abdul Samed",GHA12:"Kamaldeen Sulemana",GHA13:"Foto do Time",GHA14:"Mohammed Kudus",GHA15:"Iñaki Williams",GHA16:"Jordan Ayew",GHA17:"Andre Ayew",GHA18:"Joseph Paintsil",GHA19:"Osman Bukari",GHA20:"Antoine Semenyo",
  PAN1:"Escudo",PAN2:"Orlando Mosquera",PAN3:"Luis Mejía",PAN4:"Azmahar Ariano",PAN5:"Fidel Escobar",PAN6:"Andrés Andrade",PAN7:"Michael Amir Murillo",PAN8:"Eric Davis",PAN9:"César Blackman",PAN10:"Cristian Martínez",PAN11:"Aníbal Godoy",PAN12:"Adalberto Carrasquilla",PAN13:"Foto do Time",PAN14:"Edgar Bárcenas",PAN15:"Carlos Harvey",PAN16:"Ismael Díaz",PAN17:"Alberto Quintero",PAN18:"José Fajardo",PAN19:"Cecilio Waterman",PAN20:"Jose Luis Rodríguez",
};

// Inverte o mapa para buscar por nome
const NAME_TO_ID = {};
Object.entries(PLAYERS).forEach(([id, name]) => {
  if (name && name !== 'Escudo' && name !== 'Foto do Time') {
    NAME_TO_ID[name.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')] = id;
  }
});

function findSticker(playerName) {
  if (!playerName) return null;
  const normalized = playerName.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  
  // Detectar "FOTO DO TIME" ou "TEAM PHOTO" + código do time
  const fotoMatch = normalized.match(/(?:FOTO|TEAM|PHOTO|WE ARE|SQUAD).*?([A-Z]{2,3})$/) ||
                    normalized.match(/^([A-Z]{2,3})\s*(?:13|FOTO|TEAM|PHOTO)/);
  if (fotoMatch) {
    const sfx = fotoMatch[1];
    if (PLAYERS[sfx + '13']) return sfx + '13';
  }

  // Detectar "ESCUDO XXX" → posição 1
  const escudoMatch = normalized.match(/^ESCUDO\s+([A-Z]{2,3})$/);
  if (escudoMatch && PLAYERS[escudoMatch[1] + '1']) return escudoMatch[1] + '1';

  // Busca exata
  if (NAME_TO_ID[normalized]) return NAME_TO_ID[normalized];
  
  // Busca parcial — sobrenome
  for (const [key, id] of Object.entries(NAME_TO_ID)) {
    if (key.includes(normalized) || normalized.includes(key.split(' ').pop())) return id;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const { image, mediaType = 'image/jpeg', mode = 'pack' } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });

  const prompts = {
    pack: `Você está analisando figurinhas SOLTAS do álbum Panini FIFA World Cup 2026.
Olhe esta foto e liste APENAS os nomes de jogadores que aparecem em figurinhas completas com FOTO DO JOGADOR visível.
Os nomes aparecem em CAIXA ALTA na parte inferior de cada figurinha, ABAIXO da foto do jogador.
IMPORTANTE: Ignore espaços vazios e números impressos no álbum sem figurinha colada. Só liste se houver foto de rosto claramente visível.
Retorne APENAS um array JSON com os nomes. Exemplo: ["GABRIEL MARTINELLI", "VINICIUS JUNIOR", "RODRYGO"]
Se não identificar nenhum jogador com foto, retorne [].`,
    album: `Você está analisando uma página do álbum Panini FIFA World Cup 2026.
Identifique APENAS as figurinhas que estão COLADAS — com imagem visível.
TIPOS DE FIGURINHAS:
1. Jogador: tem foto de rosto + nome em CAIXA ALTA + código (ex: BIH3 AMER DEDIC) → retorne o nome do jogador
2. Foto do Time: tem foto coletiva do elenco + texto descritivo + código XX13 → retorne "FOTO TIME XX" (ex: "FOTO TIME BIH", "FOTO TIME MEX")
3. Escudo FOIL: figurinha brilhante/holográfica com escudo do clube → retorne "ESCUDO XX" (ex: "ESCUDO BRA")
IGNORE: espaços vazios, números impressos no fundo sem figurinha, textos do álbum.
Retorne APENAS array JSON. Exemplo: ["AMER DEDIC", "FOTO TIME BIH", "ESCUDO BIH", "NIKOLA VASILJ"]
Se nada identificado, retorne [].`,
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            { type: 'text', text: prompts[mode] || prompts.pack },
          ],
        }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message || 'API error' });

    const text = data.content?.[0]?.text || '[]';
    let names = [];
    try {
      const match = text.match(/\[[\s\S]*\]/);
      names = match ? JSON.parse(match[0]) : [];
    } catch { names = []; }

    // Mapeia nomes para IDs de figurinhas
    const found = [];
    const notFound = [];
    names.forEach(name => {
      const id = findSticker(name);
      if (id) found.push({ id, name, player: PLAYERS[id] });
      else notFound.push(name);
    });

    return res.status(200).json({ found, notFound, total: names.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
