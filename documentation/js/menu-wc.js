'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">join2.0-angular documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-c74f30497851067429b9510cf97f400f9b8f4730b34fa71d538b9ca2e3d87a3975888a69be9348d50ed95ba3c59b1995eb4df5e73c4bdcf77b5c89187d5cca2c"' : 'data-bs-target="#xs-components-links-module-AppModule-c74f30497851067429b9510cf97f400f9b8f4730b34fa71d538b9ca2e3d87a3975888a69be9348d50ed95ba3c59b1995eb4df5e73c4bdcf77b5c89187d5cca2c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-c74f30497851067429b9510cf97f400f9b8f4730b34fa71d538b9ca2e3d87a3975888a69be9348d50ed95ba3c59b1995eb4df5e73c4bdcf77b5c89187d5cca2c"' :
                                            'id="xs-components-links-module-AppModule-c74f30497851067429b9510cf97f400f9b8f4730b34fa71d538b9ca2e3d87a3975888a69be9348d50ed95ba3c59b1995eb4df5e73c4bdcf77b5c89187d5cca2c"' }>
                                            <li class="link">
                                                <a href="components/AddTaskComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddTaskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BoardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BoardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BoardEditTaskComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BoardEditTaskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BoardTaskOverlayComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BoardTaskOverlayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactsAddComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactsAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactsEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactsEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactsOverviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactsOverviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactsViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactsViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditTaskComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditTaskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderBarMobileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderBarMobileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LegalNoticeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LegalNoticeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrivacyPolicyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrivacyPolicyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResetPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignUpComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignUpComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SummaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SummaryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-c74f30497851067429b9510cf97f400f9b8f4730b34fa71d538b9ca2e3d87a3975888a69be9348d50ed95ba3c59b1995eb4df5e73c4bdcf77b5c89187d5cca2c"' : 'data-bs-target="#xs-injectables-links-module-AppModule-c74f30497851067429b9510cf97f400f9b8f4730b34fa71d538b9ca2e3d87a3975888a69be9348d50ed95ba3c59b1995eb4df5e73c4bdcf77b5c89187d5cca2c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-c74f30497851067429b9510cf97f400f9b8f4730b34fa71d538b9ca2e3d87a3975888a69be9348d50ed95ba3c59b1995eb4df5e73c4bdcf77b5c89187d5cca2c"' :
                                        'id="xs-injectables-links-module-AppModule-c74f30497851067429b9510cf97f400f9b8f4730b34fa71d538b9ca2e3d87a3975888a69be9348d50ed95ba3c59b1995eb4df5e73c4bdcf77b5c89187d5cca2c"' }>
                                        <li class="link">
                                            <a href="injectables/UserRegistrationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRegistrationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AddContactService.html" data-type="entity-link" >AddContactService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategoryService.html" data-type="entity-link" >CategoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContactService.html" data-type="entity-link" >ContactService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContactsOverlayService.html" data-type="entity-link" >ContactsOverlayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomDateParserFormatter.html" data-type="entity-link" >CustomDateParserFormatter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomDateParserFormatter-1.html" data-type="entity-link" >CustomDateParserFormatter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginService.html" data-type="entity-link" >LoginService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScreenSizeService.html" data-type="entity-link" >ScreenSizeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubtaskService.html" data-type="entity-link" >SubtaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskService.html" data-type="entity-link" >TaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserRegistrationService.html" data-type="entity-link" >UserRegistrationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/AuthInterceptorService.html" data-type="entity-link" >AuthInterceptorService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Category.html" data-type="entity-link" >Category</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Contact.html" data-type="entity-link" >Contact</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Contact-1.html" data-type="entity-link" >Contact</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Subtask.html" data-type="entity-link" >Subtask</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Subtask-1.html" data-type="entity-link" >Subtask</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Task.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User-1.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});