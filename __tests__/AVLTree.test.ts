import { AvlTree, TraverseOrder } from "../AVLTree";
import { character, characters, checkHeightAVL } from "./TestUtils";


describe("BinarySearchTreeAVL", (): void => {
    it("should insert and find nodes correctly", (): void => {
        const bst = new AvlTree<string, character>();

        characters.forEach((char: character): void => expect(bst.insert(char.name, char)).toBe(true));
        expect(bst.getSize()).toBe(characters.length);
        expect(checkHeightAVL(bst)).toBe(true);

        const char: character = characters[0];
        expect(bst.insert(char.name, char)).toBe(false);
        expect(bst.getSize()).toBe(characters.length);
        expect(checkHeightAVL(bst)).toBe(true);

        characters.forEach((char: character): void => expect(bst.find(char.name)).toEqual(char));
        expect(bst.getSize()).toBe(characters.length);
        expect(checkHeightAVL(bst)).toBe(true);
    });
    it("should delete correctly", (): void => {
        const bst = new AvlTree<string, character>();

        characters.forEach((char: character): void => expect(bst.insert(char.name, char)).toBe(true));
        expect(bst.delete("NULL")).toBe(false);
        expect(bst.getSize()).toBe(characters.length);
        expect(bst.remove("NULL")).toBe(null);
        expect(bst.getSize()).toBe(characters.length);
        expect(checkHeightAVL(bst)).toBe(true);

        expect(bst.delete(characters[2].name)).toBe(true);
        expect(bst.getSize()).toBe(characters.length - 1);
        expect(checkHeightAVL(bst)).toBe(true);

        expect(bst.remove(characters[4].name)).toEqual(characters[4]);
        expect(bst.getSize()).toBe(characters.length - 2);
        expect(checkHeightAVL(bst)).toBe(true);

        expect(bst.delete(characters[9].name)).toBe(true);
        expect(bst.getSize()).toBe(characters.length - 3);
        expect(checkHeightAVL(bst)).toBe(true);

        const charsToSkip: string[] = [characters[2].name, characters[4].name, characters[9].name];
        let charsRemaining: number = characters.length - 3;
        characters.forEach((char: character): void => {
            if (!charsToSkip.includes(char.name)) {
                expect(bst.remove(char.name)).toEqual(char);
                expect(bst.getSize()).toBe(charsRemaining - 1);
                expect(checkHeightAVL(bst)).toBe(true);
                charsRemaining--;
            }
        });
        expect(bst.getSize()).toBe(0);

        expect(bst.delete(characters[5].name)).toBe(false);
        expect(bst.remove(characters[7].name)).toBe(null);
    });
    it ("should delete, remove, find correctly in an empty tree", (): void => {
        const bst = new AvlTree<string, character>();

        expect(bst.delete("NULL")).toBe(false);
        expect(bst.find("NULL")).toBe(null);
        expect(bst.remove("NULL")).toBe(null);
        expect(bst.getSize()).toBe(0);
        expect(bst.getHeight()).toBe(0);
        expect(bst.traverse()).toEqual([]);
    });
    it ("should delete, remove, find correctly in a one node tree", (): void => {
        const bst = new AvlTree<string, character>();

        bst.insert(characters[0].name, characters[0]);
        expect(bst.traverse()).toEqual([characters[0]]);

        expect(bst.delete("NULL")).toBe(false);
        expect(bst.find("NULL")).toBe(null);
        expect(bst.remove("NULL")).toBe(null);
        expect(bst.getSize()).toBe(1);
        expect(bst.getHeight()).toBe(1);

        expect(bst.delete(characters[0].name)).toBe(true);
        expect(bst.getSize()).toBe(0);
        expect(bst.getHeight()).toBe(0);
        expect(bst.traverse()).toEqual([]);
    });
    it ("should handle insert correctly with existing keys", (): void => {
        const bst = new AvlTree<string, character>();

        characters.forEach((char: character): boolean => bst.insert(char.name, char));
        characters.forEach((char: character): void => expect(bst.insert(char.name, char)).toBe(false));
    });
    it("should traverse the tree in different orders", (): void => {
        const bst = new AvlTree<number, string>();

        [5, 3, 7, 2, 4, 6, 8].forEach((key: number): boolean => bst.insert(key, `${key}`));

        expect(bst.traverse(TraverseOrder.PRE)).toEqual(["5", "3", "2", "4", "7", "6", "8"]);
        expect(bst.traverse(TraverseOrder.IN)).toEqual(["2", "3", "4", "5", "6", "7", "8"]);
        expect(bst.traverse(TraverseOrder.POST)).toEqual(["2", "4", "3", "6", "8", "7", "5"]);
    });
    it("should handle large datasets correctly", (): void => {
        const bst = new AvlTree<number, string>();
        const keys: number[] = Array.from({ length: 10000 }, (_: unknown, i: number): number => i);

        keys.forEach((key: number): boolean => bst.insert(key, `${key}`));
        expect(bst.getSize()).toBe(keys.length);
        expect(checkHeightAVL(bst)).toBe(true);

        keys.forEach((key: number): void => {
            expect(bst.delete(key)).toBe(true);
            expect(checkHeightAVL(bst)).toBe(true);
        });
        expect(bst.getSize()).toBe(0);
    });
});