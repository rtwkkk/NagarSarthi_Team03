export const getTeamForCategory = (category?: string) => {
    const cat = category?.toLowerCase().trim();
    if (cat === 'road' || cat === 'traffic') return 'Team Alpha';
    if (cat === 'infrastructure') return 'Team Delta';
    if (cat === 'crime') return 'Team Sigma';
    if (cat === 'health') return 'Team Medic';
    if (cat === 'anomaly') return 'Team Intel';
    if (cat === 'garbage' || cat === 'sanitation') return 'Team Green';
    return 'Team Beta';
};
