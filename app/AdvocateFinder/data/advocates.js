// Advocate mock data and constants

export const ALL_COURTS = [
  'Supreme Court', 'High Court', 'District Court', 'Family Court', 'Consumer Court', 'Labour Court', 'Tribunal', 'Session Court', 'Juvenile Court', 'Civil Court', 'Criminal Court', 'Tax Court', 'Commercial Court', 'Small Causes Court', 'Motor Accident Claims Tribunal', 'Debt Recovery Tribunal', 'Arbitration Court', 'Environmental Court', 'Company Law Tribunal', 'Intellectual Property Court', 'Administrative Tribunal', 'Special CBI Court', 'Anti-Corruption Court', 'Lok Adalat', 'Fast Track Court', 'Cyber Court', 'Human Rights Court', 'Customs Court', 'Railway Claims Tribunal', 'Armed Forces Tribunal'
];

export const ALL_PRACTICE_AREAS = [
  'Bail', 'Criminal', 'Appeals', 'Civil', 'Property', 'Contracts', 'Family', 'Divorce', 'Child Custody', 'White Collar Crime', 'Corporate', 'Mergers', 'Tax', 'Consumer', 'Labour', 'Employment', 'Intellectual Property', 'Environment', 'Banking', 'Insurance', 'Cyber Law', 'Human Rights', 'Arbitration', 'Company Law', 'Customs', 'Railway', 'Motor Accident', 'Debt Recovery', 'Commercial', 'Administrative', 'Anti-Corruption'
];

export const ADVOCATES = [
  {
    id: 1,
    name: 'Amit Sharma',
    city: 'Delhi',
    court: 'Supreme Court',
    rating: 4.8,
    experience: 12,
    specialization: 'Criminal',
    photo: '',
    languages: ['English', 'Hindi'],
    barId: 'DL123456',
    email: 'amit.sharma@example.com',
    whatsapp: '+919876543210',
    verified: true,
    practiceAreas: ['Bail', 'Criminal', 'Appeals', 'White Collar Crime', 'Anti-Corruption', 'Cyber Law'],
    bio: `Amit Sharma is a highly experienced criminal lawyer practicing in the Supreme Court of India. With over a decade of experience, Amit has successfully handled numerous high-profile bail and criminal cases. He is known for his analytical skills, dedication to justice, and client-focused approach. Fluent in English and Hindi, Amit is committed to providing the best legal representation for his clients.

Amit's journey in law began with a passion for justice and a desire to make a difference in society. Over the years, he has built a reputation for his meticulous preparation, persuasive arguments, and unwavering commitment to his clients. Amit has represented clients in a wide range of criminal matters, including white collar crimes, anti-corruption cases, and cyber law offenses. His expertise extends to handling complex bail applications, appeals, and criminal trials.

In addition to his courtroom skills, Amit is known for his empathetic approach and ability to connect with clients from diverse backgrounds. He believes in transparent communication and ensures that his clients are well-informed at every stage of the legal process. Amit regularly participates in legal seminars and workshops, staying updated with the latest developments in criminal law. He is also involved in pro bono work, providing legal aid to underprivileged individuals.

Amit's dedication to his profession is reflected in the positive outcomes he has achieved for his clients. His peers and clients alike commend him for his integrity, professionalism, and results-driven approach. Whether handling a high-stakes criminal trial or advising on preventive legal strategies, Amit Sharma is a trusted advocate who stands by his clients with unwavering support and expertise.`,
  },
  {
    id: 2,
    name: 'Priya Verma',
    city: 'Mumbai',
    court: 'High Court',
    rating: 2.5,
    experience: 8,
    specialization: 'Civil',
    photo: '',
    languages: ['English', 'Marathi', 'Hindi'],
    barId: 'MH654321',
    email: 'priya.verma@example.com',
    whatsapp: '+919812345678',
    verified: false,
    practiceAreas: ['Civil', 'Property', 'Contracts', 'Consumer', 'Commercial', 'Banking', 'Insurance'],
    bio: `Priya Verma is a dedicated civil lawyer with a strong background in property and contract law. Practicing in the Mumbai High Court, Priya is known for her meticulous preparation and persuasive arguments. She is passionate about helping clients resolve complex civil disputes and is fluent in English, Marathi, and Hindi.

Priya's legal career began with a focus on property disputes, where she quickly established herself as a reliable and knowledgeable advocate. Her expertise has since expanded to include contract law, consumer protection, and commercial litigation. Priya's clients appreciate her attention to detail, strategic thinking, and ability to simplify complex legal issues.

In addition to her litigation practice, Priya is actively involved in alternative dispute resolution, including arbitration and mediation. She believes in finding practical solutions that save time and resources for her clients. Priya regularly conducts legal awareness workshops and writes articles on civil law topics, contributing to the legal community's knowledge base.

Her commitment to client service is evident in the long-term relationships she builds with her clients. Priya is approachable, responsive, and dedicated to achieving the best possible outcomes. Whether representing individuals or businesses, Priya Verma is a trusted advisor who combines legal expertise with a genuine concern for her clients' interests.`,
  },
  {
    id: 999,
    name: 'Ravi Kumar',
    city: 'Agra',
    court: 'District Court',
    rating: 2.8,
    experience: 3,
    specialization: 'Civil',
    photo: '',
    languages: ['English', 'Hindi'],
    barId: 'AG123456',
    email: 'ravi.kumar@example.com',
    whatsapp: '+919812345999',
    verified: false,
    practiceAreas: ['Civil', 'Property', 'Contracts'],
    bio: `Ravi Kumar is a civil law advocate in Agra, focusing on property and contract disputes. He is known for his thorough preparation and effective advocacy. Ravi is fluent in English and Hindi.`
  },
  // ... (rest of the ADVOCATES array from App.jsx)
  // --- BEGIN GENERATED ADVOCATES ---
  ...[...Array(90)].map((_, i) => ({
    id: 11 + i,
    name: `Advocate ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
    city: [
      'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Lucknow', 'Jaipur',
      'Chandigarh', 'Patna', 'Bhopal', 'Indore', 'Nagpur', 'Kanpur', 'Surat', 'Ranchi', 'Guwahati', 'Thiruvananthapuram'
    ][i % 20],
    court: [
      'Supreme Court', 'High Court', 'District Court', 'Family Court', 'Consumer Court', 'Labour Court', 'Tribunal', 'Session Court', 'Juvenile Court', 'Civil Court', 'Criminal Court', 'Tax Court', 'Commercial Court', 'Small Causes Court', 'Motor Accident Claims Tribunal', 'Debt Recovery Tribunal', 'Arbitration Court', 'Environmental Court', 'Company Law Tribunal', 'Intellectual Property Court', 'Administrative Tribunal', 'Special CBI Court', 'Anti-Corruption Court', 'Lok Adalat', 'Fast Track Court', 'Cyber Court', 'Human Rights Court', 'Customs Court', 'Railway Claims Tribunal', 'Armed Forces Tribunal'
    ][i % 30],
    rating: (Math.round((3.4 + (i % 15) * 0.1) * 10) / 10),
    experience: 1 + (i % 30),
    specialization: [
      'Criminal', 'Civil', 'Family', 'Corporate', 'Tax', 'Labour', 'Intellectual Property', 'Environment', 'Commercial', 'Human Rights', 'Cyber Law', 'Company Law', 'Banking', 'Insurance', 'Arbitration', 'Property', 'Consumer', 'Administrative', 'Anti-Corruption', 'Railway'
    ][i % 20],
    photo: '',
    languages: [
      ['English', 'Hindi'], ['English', 'Marathi'], ['English', 'Kannada'], ['English', 'Tamil'], ['English', 'Bengali'],
      ['English', 'Gujarati'], ['English', 'Punjabi'], ['English', 'Malayalam'], ['English', 'Telugu'], ['English', 'Odia']
    ][i % 10],
    barId: `BAR${10000 + i}`,
    email: `advocate${i + 11}@example.com`,
    whatsapp: `+9198000${(10000 + i).toString().slice(-6)}`,
    verified: i % 2 === 0,
    practiceAreas: [
      'Bail', 'Criminal', 'Appeals', 'Civil', 'Property', 'Contracts', 'Family', 'Divorce', 'Child Custody', 'White Collar Crime', 'Corporate', 'Mergers', 'Tax', 'Consumer', 'Labour', 'Employment', 'Intellectual Property', 'Environment', 'Banking', 'Insurance', 'Cyber Law', 'Human Rights', 'Arbitration', 'Company Law', 'Customs', 'Railway', 'Motor Accident', 'Debt Recovery', 'Commercial', 'Administrative', 'Anti-Corruption'
    ].slice(i % 25, (i % 25) + 5),
    bio: `Advocate ${String.fromCharCode(65 + (i % 26))}${i + 1} is an experienced lawyer practicing in ${[
      'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Lucknow', 'Jaipur',
      'Chandigarh', 'Patna', 'Bhopal', 'Indore', 'Nagpur', 'Kanpur', 'Surat', 'Ranchi', 'Guwahati', 'Thiruvananthapuram'
    ][i % 20]}. Specializes in ${[
      'Criminal', 'Civil', 'Family', 'Corporate', 'Tax', 'Labour', 'Intellectual Property', 'Environment', 'Commercial', 'Human Rights', 'Cyber Law', 'Company Law', 'Banking', 'Insurance', 'Arbitration', 'Property', 'Consumer', 'Administrative', 'Anti-Corruption', 'Railway'
    ][i % 20]} law with ${1 + (i % 30)} years of experience. Fluent in ${[
      ['English', 'Hindi'], ['English', 'Marathi'], ['English', 'Kannada'], ['English', 'Tamil'], ['English', 'Bengali'],
      ['English', 'Gujarati'], ['English', 'Punjabi'], ['English', 'Malayalam'], ['English', 'Telugu'], ['English', 'Odia']
    ][i % 10].join(', ')}.`,
  })),
  // --- END GENERATED ADVOCATES ---
];

// Add 90+ more advocates for a total of 100+
// (insert generated advocate objects here) 