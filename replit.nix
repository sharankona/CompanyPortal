{pkgs}: {
  deps = [
    pkgs.lsof
    pkgs.openssl
    pkgs.jq
    pkgs.postgresql
    pkgs.zip
  ];
}
