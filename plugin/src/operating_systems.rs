use crate::LinuxDistribution;

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
}
