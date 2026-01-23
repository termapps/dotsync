use crate::wit::dotsync::plugin::operating_systems::{
    LinuxDistribution as Distro, OperatingSystem as OS,
};

pub(crate) fn map_operating_system(i: i32) -> OS {
    match i {
        1 => OS::MacOS,
        2 => OS::Windows,
        _ => OS::UnspecifiedOS,
    }
}

pub(crate) fn map_linux_distro(i: i32) -> Distro {
    match i {
        1 => Distro::Debian,
        2 => Distro::Ubuntu,
        3 => Distro::Fedora,
        4 => Distro::CentOS,
        5 => Distro::RHEL,
        6 => Distro::Arch,
        7 => Distro::Manjaro,
        8 => Distro::OpenSUSE,
        9 => Distro::Gentoo,
        10 => Distro::Alpine,
        11 => Distro::Solus,
        12 => Distro::Mint,
        13 => Distro::PopOS,
        14 => Distro::NixOS,
        15 => Distro::Void,
        16 => Distro::Kali,
        _ => Distro::UnspecifiedDistro,
    }
}
