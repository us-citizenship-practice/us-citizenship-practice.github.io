// data-2008.js
// -----------------------------------------------------------------------
// The 100 official questions for the 2008 version of the civics test
// (USCIS, rev. 08/21). This applies to anyone who filed Form N-400
// BEFORE October 20, 2025 — filing date decides this, not interview date.
// Same field structure as data.js (the 2025 bank): id, category, question,
// answers, starred (one of the 20 "65/20" questions), varies (answer
// depends on the person or changes over time, e.g. current officeholders).
// -----------------------------------------------------------------------

const CIVICS_QUESTIONS_2008 = [

  // ---- AMERICAN GOVERNMENT: A. Principles of American Democracy ----
  { id: 1, category: "Principles of American Democracy", question: "What is the supreme law of the land?", answers: ["The Constitution"], starred: false },
  { id: 2, category: "Principles of American Democracy", question: "What does the Constitution do?", answers: ["Sets up the government", "Defines the government", "Protects basic rights of Americans"], starred: false },
  { id: 3, category: "Principles of American Democracy", question: "The idea of self-government is in the first three words of the Constitution. What are these words?", answers: ["We the People"], starred: false },
  { id: 4, category: "Principles of American Democracy", question: "What is an amendment?", answers: ["A change (to the Constitution)", "An addition (to the Constitution)"], starred: false },
  { id: 5, category: "Principles of American Democracy", question: "What do we call the first ten amendments to the Constitution?", answers: ["The Bill of Rights"], starred: false },
  { id: 6, category: "Principles of American Democracy", question: "What is one right or freedom from the First Amendment?", answers: ["Speech", "Religion", "Assembly", "Press", "Petition the government"], starred: true },
  { id: 7, category: "Principles of American Democracy", question: "How many amendments does the Constitution have?", answers: ["Twenty-seven (27)"], starred: false },
  { id: 8, category: "Principles of American Democracy", question: "What did the Declaration of Independence do?", answers: ["Announced our independence (from Great Britain)", "Declared our independence (from Great Britain)", "Said that the United States is free (from Great Britain)"], starred: false },
  { id: 9, category: "Principles of American Democracy", question: "What are two rights in the Declaration of Independence?", answers: ["Life", "Liberty", "Pursuit of happiness"], starred: false },
  { id: 10, category: "Principles of American Democracy", question: "What is freedom of religion?", answers: ["You can practice any religion, or not practice a religion."], starred: false },
  { id: 11, category: "Principles of American Democracy", question: "What is the economic system in the United States?", answers: ["Capitalist economy", "Market economy"], starred: true },
  { id: 12, category: "Principles of American Democracy", question: "What is the \u201crule of law\u201d?", answers: ["Everyone must follow the law.", "Leaders must obey the law.", "Government must obey the law.", "No one is above the law."], starred: false },

  // ---- AMERICAN GOVERNMENT: B. System of Government ----
  { id: 13, category: "System of Government", question: "Name one branch or part of the government.", answers: ["Congress", "Legislative", "President", "Executive", "The courts", "Judicial"], starred: true },
  { id: 14, category: "System of Government", question: "What stops one branch of government from becoming too powerful?", answers: ["Checks and balances", "Separation of powers"], starred: false },
  { id: 15, category: "System of Government", question: "Who is in charge of the executive branch?", answers: ["The President"], starred: false },
  { id: 16, category: "System of Government", question: "Who makes federal laws?", answers: ["Congress", "Senate and House (of Representatives)", "(U.S. or national) legislature"], starred: false },
  { id: 17, category: "System of Government", question: "What are the two parts of the U.S. Congress?", answers: ["The Senate and House (of Representatives)"], starred: true },
  { id: 18, category: "System of Government", question: "How many U.S. Senators are there?", answers: ["One hundred (100)"], starred: false },
  { id: 19, category: "System of Government", question: "We elect a U.S. Senator for how many years?", answers: ["Six (6)"], starred: false },
  { id: 20, category: "System of Government", question: "Who is one of your state\u2019s U.S. Senators now?", answers: ["Answers vary by state \u2014 look up your two current U.S. senators (D.C. and territory residents: state you have no U.S. senators)."], starred: true, varies: true },
  { id: 21, category: "System of Government", question: "The House of Representatives has how many voting members?", answers: ["Four hundred thirty-five (435)"], starred: false },
  { id: 22, category: "System of Government", question: "We elect a U.S. Representative for how many years?", answers: ["Two (2)"], starred: false },
  { id: 23, category: "System of Government", question: "Name your U.S. Representative.", answers: ["Answers vary by congressional district \u2014 look up your current U.S. representative."], starred: false, varies: true },
  { id: 24, category: "System of Government", question: "Who does a U.S. Senator represent?", answers: ["All people of the state"], starred: false },
  { id: 25, category: "System of Government", question: "Why do some states have more Representatives than other states?", answers: ["(Because of) the state\u2019s population", "(Because) they have more people", "(Because) some states have more people"], starred: false },
  { id: 26, category: "System of Government", question: "We elect a President for how many years?", answers: ["Four (4)"], starred: false },
  { id: 27, category: "System of Government", question: "In what month do we vote for President?", answers: ["November"], starred: true },
  { id: 28, category: "System of Government", question: "What is the name of the President of the United States now?", answers: ["Check uscis.gov/citizenship/testupdates for the current President of the United States."], starred: true, varies: true },
  { id: 29, category: "System of Government", question: "What is the name of the Vice President of the United States now?", answers: ["Check uscis.gov/citizenship/testupdates for the current Vice President of the United States."], starred: false, varies: true },
  { id: 30, category: "System of Government", question: "If the President can no longer serve, who becomes President?", answers: ["The Vice President"], starred: false },
  { id: 31, category: "System of Government", question: "If both the President and the Vice President can no longer serve, who becomes President?", answers: ["The Speaker of the House"], starred: false },
  { id: 32, category: "System of Government", question: "Who is the Commander in Chief of the military?", answers: ["The President"], starred: false },
  { id: 33, category: "System of Government", question: "Who signs bills to become laws?", answers: ["The President"], starred: false },
  { id: 34, category: "System of Government", question: "Who vetoes bills?", answers: ["The President"], starred: false },
  { id: 35, category: "System of Government", question: "What does the President\u2019s Cabinet do?", answers: ["Advises the President"], starred: false },
  { id: 36, category: "System of Government", question: "What are two Cabinet-level positions?", answers: ["Secretary of Agriculture", "Secretary of Commerce", "Secretary of Defense", "Secretary of Education", "Secretary of Energy", "Secretary of Health and Human Services", "Secretary of Homeland Security", "Secretary of Housing and Urban Development", "Secretary of the Interior", "Secretary of Labor", "Secretary of State", "Secretary of Transportation", "Secretary of the Treasury", "Secretary of Veterans Affairs", "Attorney General", "Vice President"], starred: false },
  { id: 37, category: "System of Government", question: "What does the judicial branch do?", answers: ["Reviews laws", "Explains laws", "Resolves disputes (disagreements)", "Decides if a law goes against the Constitution"], starred: false },
  { id: 38, category: "System of Government", question: "What is the highest court in the United States?", answers: ["The Supreme Court"], starred: false },
  { id: 39, category: "System of Government", question: "How many justices are on the Supreme Court?", answers: ["Check uscis.gov/citizenship/testupdates for the current number of Supreme Court justices."], starred: false, varies: true },
  { id: 40, category: "System of Government", question: "Who is the Chief Justice of the United States now?", answers: ["Check uscis.gov/citizenship/testupdates for the current Chief Justice of the United States."], starred: false, varies: true },
  { id: 41, category: "System of Government", question: "Under our Constitution, some powers belong to the federal government. What is one power of the federal government?", answers: ["To print money", "To declare war", "To create an army", "To make treaties"], starred: false },
  { id: 42, category: "System of Government", question: "Under our Constitution, some powers belong to the states. What is one power of the states?", answers: ["Provide schooling and education", "Provide protection (police)", "Provide safety (fire departments)", "Give a driver\u2019s license", "Approve zoning and land use"], starred: false },
  { id: 43, category: "System of Government", question: "Who is the Governor of your state now?", answers: ["Answers vary by state \u2014 look up your current governor (D.C. residents: D.C. does not have a governor)."], starred: false, varies: true },
  { id: 44, category: "System of Government", question: "What is the capital of your state?", answers: ["Answers vary by state \u2014 name your state capital (D.C. residents: D.C. is not a state and has no capital; territory residents: name the territory\u2019s capital)."], starred: true, varies: true },
  { id: 45, category: "System of Government", question: "What are the two major political parties in the United States?", answers: ["Democratic and Republican"], starred: true },
  { id: 46, category: "System of Government", question: "What is the political party of the President now?", answers: ["Check uscis.gov/citizenship/testupdates for the current President\u2019s political party."], starred: false, varies: true },
  { id: 47, category: "System of Government", question: "What is the name of the Speaker of the House of Representatives now?", answers: ["Check uscis.gov/citizenship/testupdates for the current Speaker of the House."], starred: false, varies: true },

  // ---- AMERICAN GOVERNMENT: C. Rights and Responsibilities ----
  { id: 48, category: "Rights and Responsibilities", question: "There are four amendments to the Constitution about who can vote. Describe one of them.", answers: ["Citizens eighteen (18) and older (can vote).", "You don\u2019t have to pay (a poll tax) to vote.", "Any citizen can vote. (Women and men can vote.)", "A male citizen of any race (can vote)."], starred: false },
  { id: 49, category: "Rights and Responsibilities", question: "What is one responsibility that is only for United States citizens?", answers: ["Serve on a jury", "Vote in a federal election"], starred: true },
  { id: 50, category: "Rights and Responsibilities", question: "Name one right only for United States citizens.", answers: ["Vote in a federal election", "Run for federal office"], starred: false },
  { id: 51, category: "Rights and Responsibilities", question: "What are two rights of everyone living in the United States?", answers: ["Freedom of expression", "Freedom of speech", "Freedom of assembly", "Freedom to petition the government", "Freedom of religion", "The right to bear arms"], starred: false },
  { id: 52, category: "Rights and Responsibilities", question: "What do we show loyalty to when we say the Pledge of Allegiance?", answers: ["The United States", "The flag"], starred: false },
  { id: 53, category: "Rights and Responsibilities", question: "What is one promise you make when you become a United States citizen?", answers: ["Give up loyalty to other countries", "Defend the Constitution and laws of the United States", "Obey the laws of the United States", "Serve in the U.S. military (if needed)", "Serve (do important work for) the nation (if needed)", "Be loyal to the United States"], starred: false },
  { id: 54, category: "Rights and Responsibilities", question: "How old do citizens have to be to vote for President?", answers: ["Eighteen (18) and older"], starred: true },
  { id: 55, category: "Rights and Responsibilities", question: "What are two ways that Americans can participate in their democracy?", answers: ["Vote", "Join a political party", "Help with a campaign", "Join a civic group", "Join a community group", "Give an elected official your opinion on an issue", "Call Senators and Representatives", "Publicly support or oppose an issue or policy", "Run for office", "Write to a newspaper"], starred: false },
  { id: 56, category: "Rights and Responsibilities", question: "When is the last day you can send in federal income tax forms?", answers: ["April 15"], starred: true },
  { id: 57, category: "Rights and Responsibilities", question: "When must all men register for the Selective Service?", answers: ["At age eighteen (18)", "Between eighteen (18) and twenty-six (26)"], starred: false },

  // ---- AMERICAN HISTORY: A. Colonial Period and Independence ----
  { id: 58, category: "Colonial Period and Independence", question: "What is one reason colonists came to America?", answers: ["Freedom", "Political liberty", "Religious freedom", "Economic opportunity", "Practice their religion", "Escape persecution"], starred: false },
  { id: 59, category: "Colonial Period and Independence", question: "Who lived in America before the Europeans arrived?", answers: ["American Indians", "Native Americans"], starred: false },
  { id: 60, category: "Colonial Period and Independence", question: "What group of people was taken to America and sold as slaves?", answers: ["Africans", "People from Africa"], starred: false },
  { id: 61, category: "Colonial Period and Independence", question: "Why did the colonists fight the British?", answers: ["Because of high taxes (taxation without representation)", "Because the British army stayed in their houses (boarding, quartering)", "Because they didn\u2019t have self-government"], starred: false },
  { id: 62, category: "Colonial Period and Independence", question: "Who wrote the Declaration of Independence?", answers: ["(Thomas) Jefferson"], starred: false },
  { id: 63, category: "Colonial Period and Independence", question: "When was the Declaration of Independence adopted?", answers: ["July 4, 1776"], starred: false },
  { id: 64, category: "Colonial Period and Independence", question: "There were 13 original states. Name three.", answers: ["New Hampshire", "Massachusetts", "Rhode Island", "Connecticut", "New York", "New Jersey", "Pennsylvania", "Delaware", "Maryland", "Virginia", "North Carolina", "South Carolina", "Georgia"], starred: false },
  { id: 65, category: "Colonial Period and Independence", question: "What happened at the Constitutional Convention?", answers: ["The Constitution was written.", "The Founding Fathers wrote the Constitution."], starred: false },
  { id: 66, category: "Colonial Period and Independence", question: "When was the Constitution written?", answers: ["1787"], starred: false },
  { id: 67, category: "Colonial Period and Independence", question: "The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.", answers: ["(James) Madison", "(Alexander) Hamilton", "(John) Jay", "Publius"], starred: false },
  { id: 68, category: "Colonial Period and Independence", question: "What is one thing Benjamin Franklin is famous for?", answers: ["U.S. diplomat", "Oldest member of the Constitutional Convention", "First Postmaster General of the United States", "Writer of \u201cPoor Richard\u2019s Almanac\u201d", "Started the first free libraries"], starred: false },
  { id: 69, category: "Colonial Period and Independence", question: "Who is the \u201cFather of Our Country\u201d?", answers: ["(George) Washington"], starred: false },
  { id: 70, category: "Colonial Period and Independence", question: "Who was the first President?", answers: ["(George) Washington"], starred: true },

  // ---- AMERICAN HISTORY: B. 1800s ----
  { id: 71, category: "1800s", question: "What territory did the United States buy from France in 1803?", answers: ["The Louisiana Territory", "Louisiana"], starred: false },
  { id: 72, category: "1800s", question: "Name one war fought by the United States in the 1800s.", answers: ["War of 1812", "Mexican-American War", "Civil War", "Spanish-American War"], starred: false },
  { id: 73, category: "1800s", question: "Name the U.S. war between the North and the South.", answers: ["The Civil War", "The War between the States"], starred: false },
  { id: 74, category: "1800s", question: "Name one problem that led to the Civil War.", answers: ["Slavery", "Economic reasons", "States\u2019 rights"], starred: false },
  { id: 75, category: "1800s", question: "What was one important thing that Abraham Lincoln did?", answers: ["Freed the slaves (Emancipation Proclamation)", "Saved (or preserved) the Union", "Led the United States during the Civil War"], starred: true },
  { id: 76, category: "1800s", question: "What did the Emancipation Proclamation do?", answers: ["Freed the slaves", "Freed slaves in the Confederacy", "Freed slaves in the Confederate states", "Freed slaves in most Southern states"], starred: false },
  { id: 77, category: "1800s", question: "What did Susan B. Anthony do?", answers: ["Fought for women\u2019s rights", "Fought for civil rights"], starred: false },

  // ---- AMERICAN HISTORY: C. Recent American History and Other Important Historical Information ----
  { id: 78, category: "Recent American History and Other Important Historical Information", question: "Name one war fought by the United States in the 1900s.", answers: ["World War I", "World War II", "Korean War", "Vietnam War", "(Persian) Gulf War"], starred: true },
  { id: 79, category: "Recent American History and Other Important Historical Information", question: "Who was President during World War I?", answers: ["(Woodrow) Wilson"], starred: false },
  { id: 80, category: "Recent American History and Other Important Historical Information", question: "Who was President during the Great Depression and World War II?", answers: ["(Franklin) Roosevelt"], starred: false },
  { id: 81, category: "Recent American History and Other Important Historical Information", question: "Who did the United States fight in World War II?", answers: ["Japan, Germany, and Italy"], starred: false },
  { id: 82, category: "Recent American History and Other Important Historical Information", question: "Before he was President, Eisenhower was a general. What war was he in?", answers: ["World War II"], starred: false },
  { id: 83, category: "Recent American History and Other Important Historical Information", question: "During the Cold War, what was the main concern of the United States?", answers: ["Communism"], starred: false },
  { id: 84, category: "Recent American History and Other Important Historical Information", question: "What movement tried to end racial discrimination?", answers: ["Civil rights (movement)"], starred: false },
  { id: 85, category: "Recent American History and Other Important Historical Information", question: "What did Martin Luther King, Jr. do?", answers: ["Fought for civil rights", "Worked for equality for all Americans"], starred: true },
  { id: 86, category: "Recent American History and Other Important Historical Information", question: "What major event happened on September 11, 2001, in the United States?", answers: ["Terrorists attacked the United States."], starred: false },
  { id: 87, category: "Recent American History and Other Important Historical Information", question: "Name one American Indian tribe in the United States.", answers: ["Cherokee", "Navajo", "Sioux", "Chippewa", "Choctaw", "Pueblo", "Apache", "Iroquois", "Creek", "Blackfeet", "Seminole", "Cheyenne", "Arawak", "Shawnee", "Mohegan", "Huron", "Oneida", "Lakota", "Crow", "Teton", "Hopi", "Inuit"], starred: false },

  // ---- INTEGRATED CIVICS: A. Geography ----
  { id: 88, category: "Geography", question: "Name one of the two longest rivers in the United States.", answers: ["Missouri (River)", "Mississippi (River)"], starred: false },
  { id: 89, category: "Geography", question: "What ocean is on the West Coast of the United States?", answers: ["Pacific (Ocean)"], starred: false },
  { id: 90, category: "Geography", question: "What ocean is on the East Coast of the United States?", answers: ["Atlantic (Ocean)"], starred: false },
  { id: 91, category: "Geography", question: "Name one U.S. territory.", answers: ["Puerto Rico", "U.S. Virgin Islands", "American Samoa", "Northern Mariana Islands", "Guam"], starred: false },
  { id: 92, category: "Geography", question: "Name one state that borders Canada.", answers: ["Maine", "New Hampshire", "Vermont", "New York", "Pennsylvania", "Ohio", "Michigan", "Minnesota", "North Dakota", "Montana", "Idaho", "Washington", "Alaska"], starred: false },
  { id: 93, category: "Geography", question: "Name one state that borders Mexico.", answers: ["California", "Arizona", "New Mexico", "Texas"], starred: false },
  { id: 94, category: "Geography", question: "What is the capital of the United States?", answers: ["Washington, D.C."], starred: true },
  { id: 95, category: "Geography", question: "Where is the Statue of Liberty?", answers: ["New York (Harbor)", "Liberty Island", "New Jersey", "Near New York City", "On the Hudson (River)"], starred: true },

  // ---- INTEGRATED CIVICS: B. Symbols ----
  { id: 96, category: "Symbols", question: "Why does the flag have 13 stripes?", answers: ["Because there were 13 original colonies", "Because the stripes represent the original colonies"], starred: false },
  { id: 97, category: "Symbols", question: "Why does the flag have 50 stars?", answers: ["Because there is one star for each state", "Because each star represents a state", "Because there are 50 states"], starred: true },
  { id: 98, category: "Symbols", question: "What is the name of the national anthem?", answers: ["The Star-Spangled Banner"], starred: false },

  // ---- INTEGRATED CIVICS: C. Holidays ----
  { id: 99, category: "Holidays", question: "When do we celebrate Independence Day?", answers: ["July 4"], starred: true },
  { id: 100, category: "Holidays", question: "Name two national U.S. holidays.", answers: ["New Year\u2019s Day", "Martin Luther King, Jr. Day", "Presidents\u2019 Day", "Memorial Day", "Juneteenth", "Independence Day", "Labor Day", "Columbus Day", "Veterans Day", "Thanksgiving", "Christmas"], starred: false },
];
