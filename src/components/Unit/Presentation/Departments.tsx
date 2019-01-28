/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { IDefaultState } from "src/components/types";
import { Loader } from "src/components/Loader";
import { List } from "rivet-react";
import { ISupportedDepartment } from "../store";

const Departments: React.SFC<IDefaultState<ISupportedDepartment[]>> = props => {
  const { data: departments } = props;
  return (
    <>
      <Loader {...props}>
        {departments && (
          <List variant="plain">
            {departments.map((r, i) => (
              <li key={i}>
                <a href={`/departments/${r.id}`}>{r.department.name}</a> <br />{" "}
                {r.department.description}
              </li>
            ))}
          </List>
        )}
      </Loader>
    </>
  );
};

export default Departments;
