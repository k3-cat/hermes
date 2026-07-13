import { platform, arch } from "#/prisma/.gen/enums";

export const Platforms = {
	[platform.ANY]: "",
	[platform.WINDOES]: "Windows",
	[platform.LINUX]: "Linux",
	[platform.MACOS]: "MacOS",
	[platform.ANDROID]: "Android",
	[platform.IOS]: "iOS",
} as const;

export declare type PlatformNames = typeof Platforms[keyof typeof Platforms]

export const Arches = {
	[arch.ANY]: "Any",
	[arch.X86_64]: "x86_64",
	[arch.AARCH64]: "aarch64",
	[arch.AARCH32]: "aarch64",
} as const;
