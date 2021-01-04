# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/loremipson/cyanea/compare/v2.0.0...v2.0.1) (2021-01-04)


### Bug Fixes

* get readme sorted for npm ([df9260c](https://github.com/loremipson/cyanea/commit/df9260c0d095fe47cf67cc59ff1d49bd93b7ff45))





# [2.0.0](https://github.com/loremipson/cyanea/compare/v1.0.4...v2.0.0) (2021-01-03)


### Bug Fixes

* adds support for modern modules ([02b2bd2](https://github.com/loremipson/cyanea/commit/02b2bd2962d50308b5d35445c941897e70d6a91b))
* hues are now created from the passed color ([ba651f7](https://github.com/loremipson/cyanea/commit/ba651f7efbc3a72e454a84252802a21aa81d7f48))


* feat!: doubles the light/dark variants to 40 ([bc272fe](https://github.com/loremipson/cyanea/commit/bc272fed10bbb10f717135485b20b2e3fc90fa1d))
* refactor!: gray variant adjusted ([4a1d2e6](https://github.com/loremipson/cyanea/commit/4a1d2e65f606a12c7059f8b6d39362ef2a808ccf))
* refactor!: remove complemented colors ([302b858](https://github.com/loremipson/cyanea/commit/302b85874678970ef459bba8d2467f2412e566b7))


### Features

* add sat/desat objects for passed color ([62d2895](https://github.com/loremipson/cyanea/commit/62d2895557ba9a24242819444ead59babaf3184b))


### BREAKING CHANGES

* passed color now sits and will stay at the first
position of the returned object, rather than the second.
* adds more light/dark variants. If these are being used
you will likely need to make adjustments.
* gray variant colors have changed slightly to be more
gray. With the addition of the desaturated object it made sense to
make this slight adjustment
* color complements already exist in the full spectrum,
no need to have them be on each object anymore.
