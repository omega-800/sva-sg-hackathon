pub mod decision_node;
pub mod end_node;
pub mod flowchart;
pub mod input_node;
pub mod node;
pub mod simple_node;
pub mod start_node;
pub mod node_decisions;

seaography::register_entity_modules!([
  node,
  simple_node,
  end_node,
  decision_node,
  start_node,
  input_node,
  flowchart
]);

seaography::register_active_enums!([
  node::NodeType,
  input_node::InputType,
]);
