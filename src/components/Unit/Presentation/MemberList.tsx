/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { MemberListItem } from "./MemberListItem";
import { IUnitMember, UnitMemberComparer } from "../../types";
import { Section } from "rivet-react";

export const MemberList: React.SFC<IProps> = ({
  members,
  title,
  showImages
}) => {
  return <Section className="rvt-m-bottom-lg">
      {title && <h3 className="rvt-ts-20 rvt-ts-26-lg-up rvt-m-bottom-sm rvt-text-bold">
          {title}
        </h3>}
    <div className="list-dividers list-dividers--show-last">
        {members &&
          members
            .sort(UnitMemberComparer)
            .map((m, i) => (
            <MemberListItem key={i} {...m} showImage={showImages} />
          ))}
      </div>
    </Section>;
};
interface IProps {
  members: IUnitMember[];
  title?: string;
  showImages?: boolean;
}
