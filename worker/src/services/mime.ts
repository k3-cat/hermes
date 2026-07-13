const MIME_MAP = new Map<string | undefined, string>([
	["7z", "application/x-7z-compressed"],
	["apk", "application/vnd.android.package-archive"],
	["dmg", "application/x-apple-diskimage"],
	["exe", "application/vnd.microsoft.portable-executable"],
	["msi", "application/octet-stream"],
	["zip", "application/zip"],
]);

export function detectMimeFromName(name: string) {
	return MIME_MAP.get(name.split(".").pop()) ?? "application/octet-stream";
}
