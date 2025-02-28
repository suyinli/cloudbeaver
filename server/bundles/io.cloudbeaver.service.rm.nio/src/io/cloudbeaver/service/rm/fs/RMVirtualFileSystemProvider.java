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
package io.cloudbeaver.service.rm.fs;

import org.jkiss.code.NotNull;
import org.jkiss.dbeaver.Log;
import org.jkiss.dbeaver.model.app.DBPProject;
import org.jkiss.dbeaver.model.fs.AbstractFileSystemProvider;
import org.jkiss.dbeaver.model.fs.DBFVirtualFileSystem;
import org.jkiss.dbeaver.model.rm.RMControllerProvider;
import org.jkiss.dbeaver.model.runtime.DBRProgressMonitor;

public class RMVirtualFileSystemProvider extends AbstractFileSystemProvider {
    private static final Log log = Log.getLog(RMVirtualFileSystemProvider.class);

    @Override
    public DBFVirtualFileSystem[] getAvailableFileSystems(
        @NotNull DBRProgressMonitor monitor,
        @NotNull DBPProject project
    ) {
        if (!(project instanceof RMControllerProvider)) {
            return new DBFVirtualFileSystem[0];
        }
        RMControllerProvider rmControllerProvider = (RMControllerProvider) project;
        return new DBFVirtualFileSystem[]{new RMVirtualFileSystem(rmControllerProvider.getResourceController(),
            rmControllerProvider.getRMProject())};
    }
}
