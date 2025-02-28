/*
 * DBeaver - Universal Database Manager
 * Copyright (C) 2010-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.cloudbeaver.service.navigator;

import org.jkiss.dbeaver.Log;

import java.util.ArrayList;
import java.util.List;


/**
 * WebStructContainers
 */
public class WebStructContainers {

    private static final Log log = Log.getLog(WebStructContainers.class);

    private WebNavigatorNodeInfo parentNode = null;
    private List<WebCatalog> catalogList = new ArrayList<>();
    private List<WebNavigatorNodeInfo> schemaList = new ArrayList<>();
    private boolean supportsCatalogChange = false;
    private boolean supportsSchemaChange = false;

    public Boolean getSupportsCatalogChange() {
        return supportsCatalogChange;
    }

    public Boolean getSupportsSchemaChange() {
        return supportsSchemaChange;
    }

    public WebNavigatorNodeInfo getParentNode() {
        return parentNode;
    }

    public List<WebCatalog> getCatalogList() {
        return catalogList;
    }

    public List<WebNavigatorNodeInfo> getSchemaList() {
        return schemaList;
    }

    public void setParentNode(WebNavigatorNodeInfo parentNode) {
        this.parentNode = parentNode;
    }

    public void setCatalogList(List<WebCatalog> catalogList) {
        this.catalogList = catalogList;
    }

    public void setSchemaList(List<WebNavigatorNodeInfo> schemaList) {
        this.schemaList = schemaList;
    }

    public void setSupportsCatalogChange(boolean support) {
        this.supportsCatalogChange = support;
    }

    public void setSupportsSchemaChange(boolean support) {
        this.supportsSchemaChange = support;
    }
}
