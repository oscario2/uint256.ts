// or use bigint
export class U256 {
    // primitives are always passed by value while objects are passed by reference
    private max: number;
    private bits: Array<number>;
    private size: number;

    /**
     * bitmask of N size
     * @param size 
     */
    constructor(size: number) {
        if (Math.log2(size) % 1 !== 0) {
            throw new Error('Not a power of 2')
        }
        if (size > 256) {
            throw new Error('Exceeds 256')
        }

        this.max = 32; // bitwise operates on 32-bit (2^31 - 1)
        this.bits = new Array<number>(2); // support 64-bit
        this.size = size;
    }

    // support for N amount of 32-bit registers
    private section(n: number): number {
        return Math.floor(n / this.max);
        // return n < this.max ? 0 : 1;
    }

    /**
       10110[1]1001 (729) &
       00000[1]0000 (1 << 4) (16)  =
       00000[1]0000 (16)
    */
    get(n: number): number {
        const k = this.section(n);
        // (hi|lo) & (1 << n % 32)
        return this.bits[k] & (1 << n % this.max);
    }

    /**
        1100011[0]1 (729) |
        0000000[1]0 (1 << 2) (4)  =
        1100011[1]1
    */
    set(n: number) {
        const k = this.section(n);
        this.bits[k] = this.bits[k] | (1 << n % this.max);

        return this;
    }

    /**
        1100011[0]1 (729) ^
        0000000[0]0 (1 << 2) (4)  =
        1100011[1]1

        1100011[1]1 (729) ^
        0000000[0]0 (1 << 2) (4)  =
        1100011[0]1
    */
    swap(n: number) {
        const k = this.section(n);
        this.bits[k] = this.bits[k] ^ (1 << n % this.max);

        return this;
    }

    /**
     * clear bitmask
     */
    clear() {
        this.bits = new Array(this.max);
    }

    /**
     * hexdump O(n^2)
     */
    dump() {
        const base = Math.log2(this.size);
        const slide = base * 2;

        // row
        for (let i = 0; i < this.size; i += slide) {
            const row = [] as number[];

            // column
            for (let j = 0; j < slide; j++) {
                const dot = this.get(i + j) ? 1 : 0;
                row.push(dot);
            }

            const offset = (base + i - base).toString().padEnd(4)
            console.log(offset, row.join(' '))
        }
    }
}
