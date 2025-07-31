"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProjectCardd from "./project-card";

export function ProjectGrid({ project }) {
  const route = useRouter();

  const handleEditProject = (id) => {
    route.push(`/edit/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap6">
      {project.map((item) => (
        <ProjectCardd
          key={item.id}
          proj={item}
          editClick={() => handleEditProject(item._id)}
        />
      ))}
    </div>
  );
}
