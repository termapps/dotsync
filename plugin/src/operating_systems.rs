use crate::{service::OperatingSystem, LinuxDistribution};

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

    pub(crate) fn supported_os(&self) -> Vec<i32> {
        let mut supported_os = Vec::new();

        if self.0 & 1 << 0 != 0 {
            supported_os.push(OperatingSystem::MacOS);
        }

        if self.0 & 1 << 1 != 0 {
            supported_os.push(OperatingSystem::Windows);
        }

        supported_os.iter().map(|os| *os as i32).collect()
    }

    pub(crate) fn supported_linux_distro(&self) -> Vec<i32> {
        let mut supported_linux_distro = Vec::new();

        if self.0 & 1 << 3 != 0 {
            supported_linux_distro.push(LinuxDistribution::Debian);
        }

        if self.0 & 1 << 4 != 0 {
            supported_linux_distro.push(LinuxDistribution::Ubuntu);
        }

        if self.0 & 1 << 5 != 0 {
            supported_linux_distro.push(LinuxDistribution::Fedora);
        }

        if self.0 & 1 << 6 != 0 {
            supported_linux_distro.push(LinuxDistribution::CentOS);
        }

        if self.0 & 1 << 7 != 0 {
            supported_linux_distro.push(LinuxDistribution::RHEL);
        }

        if self.0 & 1 << 8 != 0 {
            supported_linux_distro.push(LinuxDistribution::Arch);
        }

        if self.0 & 1 << 9 != 0 {
            supported_linux_distro.push(LinuxDistribution::Manjaro);
        }

        if self.0 & 1 << 10 != 0 {
            supported_linux_distro.push(LinuxDistribution::OpenSUSE);
        }

        if self.0 & 1 << 11 != 0 {
            supported_linux_distro.push(LinuxDistribution::Gentoo);
        }

        if self.0 & 1 << 12 != 0 {
            supported_linux_distro.push(LinuxDistribution::Alpine);
        }

        if self.0 & 1 << 13 != 0 {
            supported_linux_distro.push(LinuxDistribution::Solus);
        }

        if self.0 & 1 << 14 != 0 {
            supported_linux_distro.push(LinuxDistribution::Mint);
        }

        if self.0 & 1 << 15 != 0 {
            supported_linux_distro.push(LinuxDistribution::PopOS);
        }

        if self.0 & 1 << 16 != 0 {
            supported_linux_distro.push(LinuxDistribution::NixOS);
        }

        if self.0 & 1 << 17 != 0 {
            supported_linux_distro.push(LinuxDistribution::Void);
        }

        if self.0 & 1 << 18 != 0 {
            supported_linux_distro.push(LinuxDistribution::Kali);
        }

        supported_linux_distro.iter().map(|os| *os as i32).collect()
    }
}
