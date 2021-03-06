/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Footer, Header, HeaderIdentity, HeaderNavigation } from "rivet-react";
import * as Search from "../Search/store";
import { IApplicationState, IAuthUser } from "../types";
import SearchForm from "./SearchForm";
import { signInRequest, signOutRequest } from "../SignIn/store";

export interface IPageProps {
  children?: React.ReactNode;
  user?: IAuthUser;
}

const fixNavLinkAlignment = {
  paddingTop: 10
};

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IPropsFromDispatch {
  signInRequest: typeof signInRequest;
  signOutRequest: typeof signOutRequest;
  submitSearch: typeof Search.submit;
}

const Page: React.SFC<IPageProps & IPropsFromDispatch> = ({ user, signInRequest, signOutRequest, submitSearch, children }) => (
  <>
    <div style={{ minHeight: "100%", marginBottom: -59 }}>
      <Header title="IT People">
        {user && (
          <HeaderNavigation>
            <a style={fixNavLinkAlignment} href="/units">
              Units
            </a>
            {/* <a style={fixNavLinkAlignment} href="/departments">Departments</a> */}
            <SearchForm onSubmit={submitSearch} />
          </HeaderNavigation>
        )}
        {user && user.user_id != 0 && (
          <HeaderIdentity username={user.user_name} onLogout={signOutRequest}>
            <a href={`/people/${user.user_id}`}>Profile</a>
          </HeaderIdentity>
        )}
        {!user && (
          <HeaderNavigation>
            <a href="#" onClick={signInRequest}>
              Log In
            </a>
          </HeaderNavigation>
        )}
      </Header>
      <main id="main-content" className="rvt-m-top-xl rvt-m-bottom-xxl">
        {children}
      </main>
      <div style={{ height: 59 }}>&nbsp;</div>
    </div>
    <div style={{ height: 59 }}>
      <Footer />
    </div>
  </>
);

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ auth }: IApplicationState) => ({
  user: auth.data
});

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
  signInRequest: () => dispatch(signInRequest()),
  signOutRequest: () => dispatch(signOutRequest()),
  submitSearch: (q: string) => dispatch(Search.submit(q))
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
