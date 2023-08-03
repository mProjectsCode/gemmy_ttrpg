// animation.ts
import { App } from 'obsidian';

export enum AnimationStyle {
    Original = 'original',
    Draconic = 'draconic',
}

export function getAnimationFolder(app: App, animationStyle: AnimationStyle): string {
    const baseFolder = app.vault.adapter.basePath;
    return `${baseFolder}/animations/${animationStyle}`;
}
