#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord)]
#[repr(i32)]
pub enum OperatingSystem {
    UnspecifiedOS = 0,
    MacOS = 1,
    Windows = 2,
}

impl OperatingSystem {
    pub fn as_str_name(&self) -> &'static str {
        match self {
            OperatingSystem::UnspecifiedOS => "UNSPECIFIED_O_S",
            OperatingSystem::MacOS => "MAC_O_S",
            OperatingSystem::Windows => "WINDOWS",
        }
    }

    pub fn from_str_name(value: &str) -> Option<Self> {
        match value {
            "UNSPECIFIED_O_S" => Some(Self::UnspecifiedOS),
            "MAC_O_S" => Some(Self::MacOS),
            "WINDOWS" => Some(Self::Windows),
            _ => None,
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord)]
#[repr(i32)]
pub enum LinuxDistribution {
    UnspecifiedDistro = 0,
    Debian = 1,
    Ubuntu = 2,
    Fedora = 3,
    CentOS = 4,
    RHEL = 5,
    Arch = 6,
    Manjaro = 7,
    OpenSUSE = 8,
    Gentoo = 9,
    Alpine = 10,
    Solus = 11,
    Mint = 12,
    PopOS = 13,
    NixOS = 14,
    Void = 15,
    Kali = 16,
}

impl LinuxDistribution {
    pub fn as_str_name(&self) -> &'static str {
        match self {
            LinuxDistribution::UnspecifiedDistro => "UNSPECIFIED_DISTRO",
            LinuxDistribution::Debian => "DEBIAN",
            LinuxDistribution::Ubuntu => "UBUNTU",
            LinuxDistribution::Fedora => "FEDORA",
            LinuxDistribution::CentOS => "CENT_O_S",
            LinuxDistribution::RHEL => "R_H_E_L",
            LinuxDistribution::Arch => "ARCH",
            LinuxDistribution::Manjaro => "MANJARO",
            LinuxDistribution::OpenSUSE => "OPEN_S_U_S_E",
            LinuxDistribution::Gentoo => "GENTOO",
            LinuxDistribution::Alpine => "ALPINE",
            LinuxDistribution::Solus => "SOLUS",
            LinuxDistribution::Mint => "MINT",
            LinuxDistribution::PopOS => "POP_O_S",
            LinuxDistribution::NixOS => "NIX_O_S",
            LinuxDistribution::Void => "VOID",
            LinuxDistribution::Kali => "Kali",
        }
    }

    pub fn from_str_name(value: &str) -> Option<Self> {
        match value {
            "UNSPECIFIED_DISTRO" => Some(Self::UnspecifiedDistro),
            "DEBIAN" => Some(Self::Debian),
            "UBUNTU" => Some(Self::Ubuntu),
            "FEDORA" => Some(Self::Fedora),
            "CENT_O_S" => Some(Self::CentOS),
            "R_H_E_L" => Some(Self::RHEL),
            "ARCH" => Some(Self::Arch),
            "MANJARO" => Some(Self::Manjaro),
            "OPEN_S_U_S_E" => Some(Self::OpenSUSE),
            "GENTOO" => Some(Self::Gentoo),
            "ALPINE" => Some(Self::Alpine),
            "SOLUS" => Some(Self::Solus),
            "MINT" => Some(Self::Mint),
            "POP_O_S" => Some(Self::PopOS),
            "NIX_O_S" => Some(Self::NixOS),
            "VOID" => Some(Self::Void),
            "Kali" => Some(Self::Kali),
            _ => None,
        }
    }
}

pub struct OperatingSystems(u64);

impl OperatingSystems {
    pub fn all() -> Self {
        Self::new().macos().windows().linux_all()
    }

    pub fn new() -> Self {
        Self(0)
    }

    pub fn macos(self) -> Self {
        Self(self.0 | 1 << 0)
    }

    pub fn windows(self) -> Self {
        Self(self.0 | 1 << 1)
    }

    pub fn linux_all(self) -> Self {
        self.linux(LinuxDistribution::Debian)
            .linux(LinuxDistribution::Ubuntu)
            .linux(LinuxDistribution::Fedora)
            .linux(LinuxDistribution::CentOS)
            .linux(LinuxDistribution::RHEL)
            .linux(LinuxDistribution::Arch)
            .linux(LinuxDistribution::Manjaro)
            .linux(LinuxDistribution::OpenSUSE)
            .linux(LinuxDistribution::Gentoo)
            .linux(LinuxDistribution::Alpine)
            .linux(LinuxDistribution::Solus)
            .linux(LinuxDistribution::Mint)
            .linux(LinuxDistribution::PopOS)
            .linux(LinuxDistribution::NixOS)
            .linux(LinuxDistribution::Void)
            .linux(LinuxDistribution::Kali)
    }

    pub fn linux(self, distribution: LinuxDistribution) -> Self {
        Self(self.0 | 1 << (2 + distribution as u64))
    }

    pub fn supported_os(&self) -> Vec<i32> {
        let mut supported_os = Vec::new();

        if self.0 & 1 << 0 != 0 {
            supported_os.push(OperatingSystem::MacOS as i32);
        }

        if self.0 & 1 << 1 != 0 {
            supported_os.push(OperatingSystem::Windows as i32);
        }

        supported_os
    }

    pub fn supported_linux_distro(&self) -> Vec<i32> {
        let mut supported_linux_distro = Vec::new();

        if self.0 & 1 << 3 != 0 {
            supported_linux_distro.push(LinuxDistribution::Debian as i32);
        }

        if self.0 & 1 << 4 != 0 {
            supported_linux_distro.push(LinuxDistribution::Ubuntu as i32);
        }

        if self.0 & 1 << 5 != 0 {
            supported_linux_distro.push(LinuxDistribution::Fedora as i32);
        }

        if self.0 & 1 << 6 != 0 {
            supported_linux_distro.push(LinuxDistribution::CentOS as i32);
        }

        if self.0 & 1 << 7 != 0 {
            supported_linux_distro.push(LinuxDistribution::RHEL as i32);
        }

        if self.0 & 1 << 8 != 0 {
            supported_linux_distro.push(LinuxDistribution::Arch as i32);
        }

        if self.0 & 1 << 9 != 0 {
            supported_linux_distro.push(LinuxDistribution::Manjaro as i32);
        }

        if self.0 & 1 << 10 != 0 {
            supported_linux_distro.push(LinuxDistribution::OpenSUSE as i32);
        }

        if self.0 & 1 << 11 != 0 {
            supported_linux_distro.push(LinuxDistribution::Gentoo as i32);
        }

        if self.0 & 1 << 12 != 0 {
            supported_linux_distro.push(LinuxDistribution::Alpine as i32);
        }

        if self.0 & 1 << 13 != 0 {
            supported_linux_distro.push(LinuxDistribution::Solus as i32);
        }

        if self.0 & 1 << 14 != 0 {
            supported_linux_distro.push(LinuxDistribution::Mint as i32);
        }

        if self.0 & 1 << 15 != 0 {
            supported_linux_distro.push(LinuxDistribution::PopOS as i32);
        }

        if self.0 & 1 << 16 != 0 {
            supported_linux_distro.push(LinuxDistribution::NixOS as i32);
        }

        if self.0 & 1 << 17 != 0 {
            supported_linux_distro.push(LinuxDistribution::Void as i32);
        }

        if self.0 & 1 << 18 != 0 {
            supported_linux_distro.push(LinuxDistribution::Kali as i32);
        }

        supported_linux_distro
    }
}
