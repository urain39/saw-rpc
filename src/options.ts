type _ARIA2Options = {
    // TODO:
}

export type ARIA2Options = {
    [key in keyof _ARIA2Options]?: _ARIA2Options[key];
};
