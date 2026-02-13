use async_graphql::{Enum, SimpleObject};

#[derive(Debug, Clone, Enum, Copy, Eq, PartialEq)]
pub enum Canton {
  AG,
  AI,
  AR,
  BE,
  BL,
  BS,
  FR,
  GE,
  GL,
  GR,
  JU,
  LU,
  NE,
  NW,
  OW,
  SG,
  SH,
  SO,
  SZ,
  TG,
  TI,
  UR,
  VD,
  VS,
  ZG,
  ZH,
}

#[derive(Debug, Clone, Enum, Copy, Eq, PartialEq)]
pub enum LivingArrangement {
  Alone,
  WithKids,
  SharedFlat,
  Concubine,
  WithSpuse,
}

#[derive(Debug, Clone, SimpleObject)]
pub struct Personal {
  pub age: u8,
  pub has_education: bool,
  pub in_education: bool,
}

#[derive(Debug, Clone, SimpleObject)]
pub struct Living {
  pub canton: Canton,
  pub living_arrangement: LivingArrangement,
}

#[derive(Debug, Clone, SimpleObject)]
pub struct Assets {
  pub assets: u32,
  pub income: Option<Income>,
}

#[derive(Debug, Clone, SimpleObject)]
pub struct Income {
  pub salary: u32,
  pub travel_costs: u32,
  pub workload: u8,
}

#[derive(Debug, Clone, SimpleObject)]
pub struct Expenses {
  pub has_welfare: bool,
  pub rent: u32,
  pub additional_costs: u32,
  pub kvg: u32,
  pub kids: Option<Kids>,
}

#[derive(Debug, Clone, SimpleObject)]
pub struct Kids {
  pub kvg: u32,
  pub care: u32,
}

#[derive(Debug, Clone, SimpleObject)]
pub struct Entry {
  pub id: String,
  pub living: Living,
  pub personal: Personal,
  pub assets: Assets,
  pub expenses: Expenses,
}
