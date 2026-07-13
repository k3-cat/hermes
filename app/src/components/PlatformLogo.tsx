
import { platform } from "#/prisma/.gen/enums";
import { Platforms, type PlatformNames } from "@/lib/platform-display";
import { AndroidLogoIcon, AppleLogoIcon, AppStoreLogoIcon, LinuxLogoIcon, WindowsLogoIcon } from "@phosphor-icons/react";

interface IProps {
	platformName: PlatformNames
}

export function PlatformLogo({platformName}:IProps) {
	if (platformName === Platforms[platform.ANY]) {
		return <></>
	}
	if (platformName === Platforms[platform.WINDOES]) {
		return <WindowsLogoIcon />
	}
	if (platformName === Platforms[platform.LINUX]) {
		return <LinuxLogoIcon />
	}
	if (platformName === Platforms[platform.MACOS]) {
		return <AppleLogoIcon />
	}
	if (platformName === Platforms[platform.ANDROID]) {
		return <AndroidLogoIcon />
	}
	if (platformName === Platforms[platform.IOS]) {
		return <AppStoreLogoIcon />
	}

	return;
}
