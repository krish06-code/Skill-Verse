import { useState } from "react";
import { Plus } from "lucide-react";
import { SkillTag } from "@/components/SkillTag";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SkillTagInputProps {
  label: string;
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillTagInput({ label, skills, onChange }: SkillTagInputProps) {
  const [value, setValue] = useState("");

  function addSkill() {
    const trimmed = value.trim();
    if (!trimmed || skills.includes(trimmed)) {
      setValue("");
      return;
    }
    onChange([...skills, trimmed]);
    setValue("");
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <span className="text-sm text-muted-foreground">No skills added yet.</span>
        ) : (
          skills.map((skill) => (
            <SkillTag
              key={skill}
              label={skill}
              onRemove={() => onChange(skills.filter((s) => s !== skill))}
            />
          ))
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          placeholder="Add a skill"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addSkill}>
          <Plus className="mr-1 h-4 w-4" /> Add Skill
        </Button>
      </div>
    </div>
  );
}
