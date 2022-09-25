import React from "react";
import { useForm } from "react-hook-form";
import { nano, theme } from "../../style";
import { RequireComponent } from "../../tsHelpers";

const styles = nano.sheet({
  input: {
    "&:focus": {
      background: "rgba(255,255,255,0.2)",
    },
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "4px",
    color: theme.palette.default,
    fontSize: theme.typography.default,
    marginBottom: theme.spacing(1),
    outline: 0,
    height: "32px",
    padding: "4px 8px",
    transition: "200ms",
    width: "100%",
  },
});

const EntityName: React.FC<{ entity: RequireComponent<"name"> }> = ({
  entity,
}) => {
  const { register, handleSubmit, reset, getValues } = useForm();

  React.useEffect(reset, [entity]);

  const onSubmit = () => {
    entity.cp.name.value = getValues().name || "Unnamed Sector";
    reset();
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", {
          onBlur: onSubmit,
        })}
        className={styles.input}
        defaultValue={entity.cp.name.value}
      />
    </form>
  );
};

export default EntityName;
