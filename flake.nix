{
  description = "rust development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      rust-overlay,
    }:
    let
      systems = nixpkgs.lib.platforms.unix;
      eachSystem =
        f:
        nixpkgs.lib.genAttrs systems (
          system:
          f (
            import nixpkgs {
              inherit system;
              config = { };
              overlays = [
                rust-overlay.overlays.default
                self.overlays.default
              ];
            }
          )
        );
    in
    {
      overlays.default = _: prev: {
        rustToolchain = prev.rust-bin.stable.latest.default.override {
          extensions = [
            "rust-src"
            "rustfmt"
          ];
        };
      };
      devShells = eachSystem (pkgs: {
        default = pkgs.mkShellNoCC {
          packages = with pkgs; [
            rustToolchain
            openssl
            pkg-config
            rust-analyzer
            bacon
            # cargo-deny
            # cargo-edit
            # cargo-watch
            typescript
            typescript-language-server
            nodejs_24
          ];
          env = {
            RUST_BACKTRACE = 1;
            RUST_SRC_PATH = "${pkgs.rustToolchain}/lib/rustlib/src/rust/library";
          };
        };
      });
      packages = eachSystem (
        pkgs:
        let
          fs = pkgs.lib.fileset;
          backend = pkgs.rustPlatform.buildRustPackage {
            pname = "backend";
            version = "0.0.1";
            src = fs.toSource {
              root = ./backend;
              fileset = fs.intersection (fs.gitTracked ./backend) (
                fs.unions [
                  ./backend/Cargo.toml
                  ./backend/Cargo.lock
                  (fs.fileFilter (f: f.hasExt "rs") ./backend/src)
                ]
              );
            };
            cargoLock.lockFile = ./backend/Cargo.lock;
          };
          frontend = pkgs.writeShellApplication {
            name = "frontend";
            text = "npm run --prefix ./frontend start";
          };
          frontend-dev = frontend;
          backend-dev = pkgs.writeShellApplication {
            name = "backend-dev";
            text = "bacon --project ./backend --job run";
          };
        in
        {
          inherit
            backend
            frontend
            backend-dev
            frontend-dev
            ;
          default = backend;
          dev = pkgs.writeShellApplication {
            name = "dev";
            text = "(trap 'kill 0' SIGINT; ${frontend-dev}/bin/frontend & ${backend-dev}/bin/backend-dev)";
          };
        }
      );
      apps = eachSystem (
        pkgs:
        pkgs.lib.mapAttrs (n: v: {
          type = "app";
          program = "${v}/bin/${n}";
        }) self.packages
      );
    };
}
