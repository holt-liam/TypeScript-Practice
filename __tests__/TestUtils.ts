export type character = {name: string, class: string, gun: string};

export const characters: character[] = [
    {name: "Kaidan", class: "Sentinel", gun: "Pistol"},
    {name: "Ashley", class: "Soldier", gun: "Assault Rifle"},
    {name: "Garrus", class: "Infiltrator", gun: "Sniper Rifle"},
    {name: "Wrex", class: "Vanguard", gun: "Shotgun"},
    {name: "Tali", class: "Engineer", gun: "Shotgun"},
    {name: "Liara", class: "Adept", gun: "Pistol"},
    {name: "Jacob", class: "Vanguard", gun: "Shotgun"},
    {name: "Miranda", class: "Sentinel", gun: "SMG"},
    {name: "Mordin", class: "Engineer", gun: "Pistol"},
    {name: "Jack", class: "Adept", gun: "Shotgun"},
    {name: "Grunt", class: "Soldier", gun: "Shotgun"},
    {name: "Thane", class: "Vanguard", gun: "Sniper Rifle"},
    {name: "Samara", class: "Adept", gun: "Assault Rifle"},
    {name: "Legion", class: "Infiltrator", gun: "Sniper Rifle"},
    {name: "Kasumi", class: "Infiltrator", gun: "SMG"},
    {name: "Zaeed", class: "Soldier", gun: "Sniper Rifle"},
    {name: "James", class: "Soldier", gun: "Shotgun"},
    {name: "EDI", class: "Engineer", gun: "SMG"},
    {name: "Javik", class: "Vanguard", gun: "Assault Rifle"}
];

interface IBstBalanceCheck {
    getHeight(): number;
    getSize(): number;
}

export function checkHeightAVL<T extends IBstBalanceCheck>(bst: T): boolean {
    const minHeight: number =
        Math.ceil(Math.log2(bst.getSize() + 1));
    const maxHeight: number =
        Math.floor(1.44 * Math.log2(bst.getSize() + 2) - 0.328);

    return minHeight <= bst.getHeight() && bst.getHeight() <= maxHeight;
}